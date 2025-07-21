import ReviewModel from "../../models/review/ReviewModel.js";
import mongoose from "mongoose";

export const ReviewListService = async (req, res) => {
    try {
        const productId = req.params.id;

        const reviews = await ReviewModel.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    title: 1,
                    review: 1,
                    images: 1,
                    createdAt: 1,
                    "user._id": 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "user.photo": 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return {
            status: "success",
            data: reviews
        };
    } catch (error) {
        return {
            status: "error",
            message: error.message
        };
    }
};