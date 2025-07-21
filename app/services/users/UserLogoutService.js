import UsersModel from "../../models/users/UsersModel.js";
import {ObjectId} from "mongodb";

const UserLogoutService = async (req, res) =>{
    try{

        const userId = new ObjectId(req.headers['user_id']);

        res.clearCookie('Token', {
            httpOnly: true,
            sameSite: "none",
            secure: true
        });

        return{ status: 'success', message: 'Logout completed successfully!', data: userId };

    }catch (e) {
        return { status: 'fail', message: 'An error occurred during registration.' };
    }
}

export default UserLogoutService;