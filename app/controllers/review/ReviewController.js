import {CreateReviewService} from "../../services/review/CreateReviewService.js";
import {ReviewListService} from "../../services/review/ReviewListService.js";
import {ReviewDeleteService} from "../../services/review/ReviewDeleteService.js";

// Create
export const CreateReview = async (req, res) => {
    const result = await CreateReviewService(req, res);
    res.json(result);
}

// Review List
export const ReviewList = async (req, res) => {
    const result = await ReviewListService(req, res);
    res.json(result);
}

// Review Delete
export const ReviewDelete = async (req, res) => {
    const result = await ReviewDeleteService(req, res);
    res.json(result);
}