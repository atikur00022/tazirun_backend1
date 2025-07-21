import {TokenDecode} from "../utility/TokenUtility.js";

export default (req, res, next) => {

    // const token = req.headers["token"];
    const token = req.cookies['Token'];
    const decoded = TokenDecode(token);

    if(decoded === null){
        return res.status(401).json({status: "fail", message: "Unauthorized"});
    }else{

        const { email, user_id, isBanned, role } = decoded;

        req.headers.email = email;
        req.headers.user_id = user_id;
        req.headers.isBanned = isBanned;
        req.headers.role = role;

        if (isBanned === true) {
            return res.status(403).json({ status: 'fail', message: 'You are banned!' });
        }

        next();

    }

}
