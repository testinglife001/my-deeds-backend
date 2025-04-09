import jwt from "jsonwebtoken";
// const jwt = require('jsonwebtoken');

export const admin_middleware = async (req, res, next) => {
    // console.log(req);
    const {token} = req.cookies;
    // console.log(blog_token);
    if(!token){
        res.status(409).json({errorMessage: {error: 'Please login first'}});
    } else {
        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodeToken);
        req.adminId = decodeToken.id;
        req.adminName = decodeToken.name;
        req.role = decodeToken.role;
        next();
    }
}




