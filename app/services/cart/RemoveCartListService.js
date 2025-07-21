import {ObjectId} from "mongodb";
import CartModel from "../../models/cart/CartModel.js";

export const RemoveCartListService = async (req) => {
    try {

        let userId = new ObjectId(req.headers['user_id']);
        let id = new ObjectId(req.params['id']);
        let postBody = req.body;
        postBody.userId = userId;

        await CartModel.deleteOne({_id: id, userId: userId});

        return {status:"success", message:"Cart item removed successfully!"};

    }catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}