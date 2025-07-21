import {ObjectId} from "mongodb";
import CartModel from "../../models/cart/CartModel.js";

export const SaveCartListService = async (req) => {
    try {

        let userId = new ObjectId(req.headers['user_id'])
        let postBody = req.body;
        postBody.userId = userId;

        await CartModel.create(postBody);

        return {status:"success", message:"Product add to cart successfully!"};

    }catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}