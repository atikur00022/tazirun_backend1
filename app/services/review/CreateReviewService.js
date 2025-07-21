import ReviewModel from "../../models/review/ReviewModel.js";
import {ObjectId} from "mongodb";
import cloudinary from "../../config/cloudinary.js";

export const CreateReviewService = async (req, res) => {
    try {
        const { rating, title, review } = req.body;
        const role = req.headers['role'];
        const userId = new ObjectId(req.headers['user_id']);
        const productId = new ObjectId(req.params['id']);
        let imageUrls = [];

        if(role === "superadmin" || role === "admin" || role === "user"){

            // Validate input
            if (!productId || !rating || !title || !review) {
                return {
                    status: "fail",
                    message: "All fields are required"
                };
            }

            // Check if user already reviewed this product
            const existingReview = await ReviewModel.findOne({
                productId,
                userId
            });

            if (existingReview) {
                return {
                    status: "fail",
                    message: "You have already reviewed this product"
                };
            }

            // Handle image uploads if any
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(file =>
                    cloudinary.uploader.upload(file.path, {
                        folder: 'Tajir/reviews',
                        resource_type: 'auto'
                    })
                );

                const results = await Promise.all(uploadPromises);
                imageUrls = results.map(result => result.secure_url);
            }

            const newReview = await ReviewModel.create({
                productId,
                userId,
                rating,
                title,
                review,
                images: imageUrls
            });

            return { status: "success", message: "Review created successfully!", data: newReview };

        }else {
            return { status: "fail", message: "You are not authorized!" };
        }
    } catch (error) {
        return {
            status: "error",
            message: error.message
        };
    }
};