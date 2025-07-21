
import mongoose from "mongoose";
import SaleModel from "../../models/sales/SalesModel.js";

export const CreateSales = async (req, res) => {
    try {
        // Get user_id from headers (set by your middleware)
        const userId = req.headers.user_id;

        if (!userId) {
            return res.status(401).json({
                status: "fail",
                message: "User not authenticated"
            });
        }

        const {
            customerId,
            customerName,
            regionId,
            thanaId,
            districtId,
            divisionId,
            vatTax,
            discount,
            otherCost,
            shippingCost,
            grandTotal,
            note,
            items
        } = req.body;

        // Calculate grand total if not provided
        let calculatedGrandTotal = grandTotal;
        if (!grandTotal && items) {
            const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
            const vatAmount = (vatTax / 100) * subtotal;
            calculatedGrandTotal = subtotal + vatAmount - discount + otherCost + shippingCost;
        }

        const newSale = new SaleModel({
            userId,  // Using user_id from headers
            customerId,
            customerName,
            regionId,
            thanaId,
            districtId,
            divisionId,
            items,
            vatTax: vatTax || 0,
            discount: discount || 0,
            otherCost: otherCost || 0,
            shippingCost: shippingCost || 0,
            grandTotal: calculatedGrandTotal,
            note
        });

        await newSale.save();

        res.status(200).json({
            status: "success",
            message: "Sale created successfully",
            data: newSale
        });
    } catch (error) {
        res.status(200).json({
            status: "fail",
            message: error.message
        });
    }
};

export const SalesList = async (req, res) => {
    try {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        const searchKeyword = req.params.searchKeyword;

        let query = {};

        if (searchKeyword !== "0") {
            query.$or = [
                { customerName: { $regex: searchKeyword, $options: "i" } },
                { "items.productName": { $regex: searchKeyword, $options: "i" } },
                { note: { $regex: searchKeyword, $options: "i" } }
            ];
        }

        const skipRow = (pageNo - 1) * perPage;

        const total = await SaleModel.countDocuments(query);
        const data = await SaleModel.find(query)
            .skip(skipRow)
            .limit(perPage)
            .sort({ createdAt: -1 });

        // Transform data for backward compatibility
        const transformedData = data.map(sale => {
            const saleObj = sale.toObject();

            // For single item sales, add direct product fields
            if (sale.items.length === 1) {
                saleObj.productId = sale.items[0].productId;
                saleObj.productName = sale.items[0].productName;
            }

            return saleObj;
        });

        res.status(200).json({
            status: "success",
            data: transformedData,
            total: total,
            perPage: perPage,
            currentPage: pageNo
        });
    } catch (error) {
        res.status(200).json({
            status: "fail",
            message: error.message
        });
    }
};

export const DeleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(200).json({
                status: "fail",
                message: "Invalid sale ID"
            });
        }

        const result = await SaleModel.findByIdAndDelete(id);

        if (!result) {
            return res.status(200).json({
                status: "fail",
                message: "Sale not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Sale deleted successfully"
        });
    } catch (error) {
        res.status(200).json({
            status: "fail",
            message: error.message
        });
    }
};