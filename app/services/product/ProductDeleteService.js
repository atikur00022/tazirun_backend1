import { ObjectId } from "mongodb";
import ProductsModel from "../../models/products/ProductsModel.js";
import cloudinary from "../../config/cloudinary.js";

export const ProductDeleteService = async (req, res) => {
    try {
        const id = new ObjectId(req.params["id"]);
        const product = await ProductsModel.findOne({ _id: id });

        if (!product) {
            return { status: "fail", message: "Product not found" };
        }

        // Collect all image URLs (adjust if stored differently)
        const imageUrls = [
            product.image1,
            product.image2,
            product.image3,
            product.image4,
            product.image5,
        ].filter(Boolean); // Remove null/undefined

        // Extract public IDs
        const publicIds = imageUrls.map((url) => {
            const parts = url.split('/');
            const filename = parts[parts.length - 1];
            return `Tajir/products/${filename.split('.')[0]}`;
        });

        // Delete all images in parallel
        await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));

        // Delete product from database
        await ProductsModel.deleteOne({ _id: id });

        return { status: "success", message: "Delete successful!" };
    } catch (e) {
        return { status: "fail", data: e.toString() };
    }
};
