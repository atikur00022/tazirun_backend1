import CategoriesModel from "../../models/categories/CategoriesModel.js";
import cloudinary from "../../config/cloudinary.js";

export const CreateCategoryService = async (req, res) => {
    try {

        const role = req.headers['role'];
        const { name } = req.body;

        if(role === "superadmin" || role === "admin"){

            // Check if an image file was uploaded
            if (!req.file) {
                return { status: "fail", message: "Image is required!" };
            }

            const categoryImage = req.file.path;

            // Store image into cloudinary
            const response = await cloudinary.uploader.upload(categoryImage, {
                folder: 'Tajir/categories',
            });

            const data = await CategoriesModel.create({
                name,
                image: response.secure_url,
            });

            return { status: "success", message: "Request Successful!", data: data };


        }else {
            return { status: "fail", message: "You are not authorized!" };
        }


    } catch (e) {
        return { status: "fail", data: e.toString() };
    }
}