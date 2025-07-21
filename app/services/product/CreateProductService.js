import cloudinary from "../../config/cloudinary.js";
import ProductsModel from "../../models/products/ProductsModel.js";
import fs from 'fs';
import {ALL_DEFAULT_IMAGE} from "../../config/config.js";

export const CreateProductService = async (req, res) => {
    try {
        const role = req.headers['role'];

        if (role !== "superadmin" && role !== "admin") {
            return { status: "fail", message: "You are not authorized!" };
        }

        // Parse form data
        const {
            name, price, discount, discountPrice, stock, size, remark, unit,
            details, specification, videoUrl, campaignId, brandId, categoryId,
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

        // Handle image uploads
        const imageUrls = [];
        const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5'];

        for (let field of imageFields) {
            if (req.files && req.files[field]) {
                const imageFile = req.files[field][0];
                const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                    folder: 'Tajir/products',
                });
                imageUrls.push(uploadResponse.secure_url);
                fs.unlinkSync(imageFile.path);
            } else {
                imageUrls.push(ALL_DEFAULT_IMAGE);
            }
        }

        // Create product
        const newProduct = await ProductsModel.create({
            name,
            price: parseFloat(price) || 0,
            discount: parseFloat(discount) || 0,
            discountPrice: parseFloat(discountPrice) || 0,
            stock: parseInt(stock) || 0,
            colorVariants: parsedColorVariants,
            size,
            remark,
            unit,
            details,
            specification,
            videoUrl,
            campaignId: campaignId || null,
            brandId: brandId || null,
            categoryId: categoryId || null,
            subCategoryId: subCategoryId || null,
            subSubCategoryId: subSubCategoryId || null,
            image1: imageUrls[0],
            image2: imageUrls[1],
            image3: imageUrls[2],
            image4: imageUrls[3],
            image5: imageUrls[4],
        });

        return {
            status: "success",
            message: "Product created successfully!",
            data: newProduct,
        };

    } catch (e) {
        console.error("CreateProductService error:", e);
        return {
            status: "fail",
            message: e.message || "Something went wrong!",
            error: e.errors
        };
    }
};