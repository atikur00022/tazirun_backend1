import bcrypt from 'bcrypt';
import { TokenEncode } from "../../utility/TokenUtility.js";
import UsersModel from "../../models/users/UsersModel.js";

const UserLoginService = async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await UsersModel.aggregate([
            { $match: { email } }
        ]);

        if (data.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'User does not exist!'
            });
        }

        const MatchingPassword = await bcrypt.compare(password, data[0].password);

        if (!MatchingPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Credential Incorrect!'
            });
        }

        if (data[0].isBanned === true) {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to login! Please contact the authorities.'
            });
        }

        const userDetails = {
            email: data[0].email,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            mobile: data[0].mobile,
            photo: data[0].photo,
            role: data[0].role
        };

        const token = await TokenEncode(
            data[0]._id,
            data[0].email,
            data[0].isBanned,
            data[0].role
        );

        const cookieOptions = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: "none",  // for cross-origin
            secure: true       // for HTTPS
        };

        res.cookie('Token', token, cookieOptions);

        return res.status(200).json({
            status: 'success',
            message: 'Login completed successfully!',
            data: userDetails
        });

    } catch (e) {
        console.error("Login error:", e); // Logs real error in Render logs
        return res.status(500).json({
            status: 'fail',
            message: 'An error occurred during login.',
            error: e.message // remove in production if needed
        });
    }
};

export default UserLoginService;
