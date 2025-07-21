import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CartModel from "../../models/cart/CartModel.js";
import InvoiceModel from "../../models/invoice/InvoiceModel.js";
import ProductsModel from "../../models/products/ProductsModel.js";

export const CreateInvoiceService = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate user ID
        if (!req.headers['user_id'] || !ObjectId.isValid(req.headers['user_id'])) {
            await session.abortTransaction();
            return { status: "fail", message: "Invalid user ID" };
        }

        const user_id = new ObjectId(req.headers['user_id']);
        const { name, phone, altPhone, area, thana, district, division, shippingOption, shippingCost, subtotal, totalPayable, paymentMethod } = req.body;

        // Validate required fields
        const requiredFields = ['name', 'phone', 'area', 'thana', 'district', 'division', 'shippingOption', 'shippingCost', 'subtotal', 'totalPayable'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            await session.abortTransaction();
            return { status: "fail", message: `Missing required fields: ${missingFields.join(', ')}` };
        }

        // Get cart items with product details
        const cartItems = await CartModel.aggregate([
            { $match: { userId: user_id } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    productId: 1,
                    qty: 1,
                    color: 1,
                    size: 1,
                    product: 1
                }
            }
        ]).session(session);

        if (cartItems.length === 0) {
            await session.abortTransaction();
            return { status: "fail", message: "Cart is empty! Add product to your cart first!" };
        }

        // Check stock availability before processing
        for (const item of cartItems) {
            const product = await ProductsModel.findById(item.productId).session(session);
            if (!product) {
                await session.abortTransaction();
                return { status: "fail", message: `Product ${item.productId} not found` };
            }

            // Check stock for specific color variant if color is specified
            if (item.color) {
                const colorVariant = product.colorVariants.find(v => v.color === item.color);
                if (!colorVariant || colorVariant.quantity < item.qty) {
                    await session.abortTransaction();
                    return { status: "fail", message: `Insufficient stock for ${product.name} (color: ${item.color})` };
                }
            } else if (product.stock < item.qty) {
                await session.abortTransaction();
                return { status: "fail", message: `Insufficient stock for ${product.name}` };
            }
        }

        // Prepare products for invoice
        const invoiceProducts = cartItems.map(item => ({
            productId: item.productId,
            name: item.product.name,
            quantity: item.qty,
            color: item.color,
            size: item.size,
            price: item.product.discount > 0 ? item.product.discountPrice : item.product.price
        }));

        // Prepare shipping details
        const ship_details = `Name:${name}, Number:${phone}, AlternateNumber:${altPhone || 'N/A'}, Area:${area}, Thana:${thana}, District:${district}, Division:${division}`;

        // Generate transaction ID
        const tran_id = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Create invoice
        const newInvoice = await InvoiceModel.create([{
            userId: user_id,
            sub_total: parseFloat(subtotal),
            shippingCost: parseFloat(shippingCost),
            payable: parseFloat(totalPayable),
            shiping_area: shippingOption,
            ship_details: ship_details,
            tran_id: tran_id,
            val_id: "0",
            payment_status: "pending",
            delivery_status: "pending",
            paymentMethod: paymentMethod || 'cash_on_delivery',
            products: invoiceProducts
        }], { session });

        // Update product stock
        for (const item of cartItems) {
            const updateOperations = {
                $inc: { stock: -item.qty }
            };

            if (item.color) {
                updateOperations.$inc = updateOperations.$inc || {};
                updateOperations.$inc["colorVariants.$[elem].quantity"] = -item.qty;
            }

            await ProductsModel.updateOne(
                { _id: item.productId },
                updateOperations,
                {
                    arrayFilters: item.color ? [{ "elem.color": item.color }] : [],
                    session
                }
            );
        }

        // Clear cart
        await CartModel.deleteMany({ userId: user_id }).session(session);

        await session.commitTransaction();

        return {
            status: "success",
            message: "Order created successfully! Wait for confirmation.",
            data: {
                invoiceId: newInvoice[0]._id,
                tran_id: tran_id,
                totalPayable: totalPayable
            }
        };

    } catch (error) {
        await session.abortTransaction();
        console.error("Invoice creation error:", error);
        return {
            status: "error",
            message: "Failed to create invoice",
            error: error.message
        };
    } finally {
        session.endSession();
    }
};