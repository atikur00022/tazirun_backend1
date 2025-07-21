import UsersModel from "../../models/users/UsersModel.js";
import {ObjectId} from "mongodb";

export const UserDetailsService = async (req, res) => {
    try{

        const userID = new ObjectId(req.headers['user_id']);

        const data = await UsersModel.aggregate([
            { $match: { _id: userID } },
            { $project: { _id:0, isBanned:0, password: 0, role:0, createdAt:0, updatedAt:0 } }
        ]);

        return { status: "success", message: "Request successfully", data: data };
    }catch (e) {
        return { status: "error", message: e.toString() };
    }
}