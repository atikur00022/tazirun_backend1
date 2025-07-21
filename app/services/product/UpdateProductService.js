import ProductsModel from "../../models/products/ProductsModel.js";
import cloudinary from "../../config/cloudinary.js";
import { ObjectId } from "mongodb";
import fs from 'fs';
import { ALL_DEFAULT_IMAGE } from "../../config/config.js";

export const UpdateProductService = async (req, res) => {
    try {
        const role = req.headers['role'];
        const id = new ObjectId(req.params.id);

        if (role !== "superadmin" && role !== "admin") {
            return { status: "fail", message: "You are not authorized!" };
        }

        const existingProduct = await ProductsModel.findById(id);
        if (!existingProduct) {
            return { status: "fail", message: "Product not found!" };
        }

        // Parse form data
        const {
            name, price, discount, discountPrice, stock, size, remark, unit,
            videoUrl, details, specification, campaignId, brandId, categoryId,
            subCategoryId, subSubCategoryId, colorVariants
        } = req.body;

        // Parse and validate colorVariants
        let parsedColorVariants = [];
        try {
            parsedColorVariants = typeof colorVariants === 'string' ?
                JSON.parse(colorVariants) :
                (colorVariants || []);

            // Validate each variant
            parsedColorVariants = parsedColorVariants.map(variant => ({
                color: (variant.color || '').trim(),
                quantity: parseInt(variant.quantity) || 0
            })).filter(variant => variant.color !== '');
        } catch (e) {
            console.error("Error parsing colorVariants:", e);
            return { status: "fail", message: "Invalid color variants format" };
        }

        // Prepare update fields
        const updateFields = {
            name,
            price: parseFloat(price) || 0,
            discount: parseFloat(discount) || 0,
            discountPrice: parseFloat(discountPrice) || 0,
            stock: parseInt(stock) || 0,
            colorVariants: parsedColorVariants,
            size,
            remark,
            unit,
            videoUrl,
            details,
            specification,
            campaignId: campaignId || null,
            brandId: brandId || null,
            categoryId: categoryId || null,
            subCategoryId: subCategoryId || null,
            subSubCategoryId: subSubCategoryId || null,
        };

        // Handle image uploads
        const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5'];
        for (const field of imageFields) {
            if (req.files && req.files[field]) {
                const file = req.files[field][0];

                // Delete old image if not default
                if (existingProduct[field] && existingProduct[field] !== ALL_DEFAULT_IMAGE) {
                    try {
                        const publicId = existingProduct[field].split('/').slice(-2).join('/').split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    } catch (error) {
                        console.error(`Cloudinary delete failed for ${field}:`, error.message);
                    }
                }

                // Upload new image
                try {
                    const uploaded = await cloudinary.uploader.upload(file.path, {
                        folder: 'Tajir/products'
                    });
                    updateFields[field] = uploaded.secure_url;
                } catch (uploadError) {
                    console.error(`Cloudinary upload failed for ${field}:`, uploadError.message);
                    updateFields[field] = existingProduct[field];
                }

                // Remove temp file
                fs.unlinkSync(file.path);
            } else {
                updateFields[field] = existingProduct[field] || ALL_DEFAULT_IMAGE;
            }
        }

        // Update in DB
        const result = await ProductsModel.updateOne(
            { _id: id },
            { $set: updateFields }
        );

        return {
            status: "success",
            message: "Product updated successfully!",
            data: result
        };

    } catch (error) {
        console.error("Error in UpdateProductService:", error);
        return {
            status: "fail",
            message: error.message || "Something went wrong!",
            error: error.errors
        };
    }
};