import {ObjectId} from "mongodb";
import CartModel from "../../models/cart/CartModel.js";

export const UpdateCartListService = async (req) => {
    try {

        let userId = new ObjectId(req.headers['user_id']);
        let id = new ObjectId(req.params['id']);
        let postBody = req.body;
        postBody.userId = userId;

        await CartModel.updateOne({ _id: id, userId: userId }, {$set: {postBody}});

        return {status:"success", message:"Cart updated successfully!"};

    }catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}