const jwt = require("jsonwebtoken");
const storeUsers = require('../models/shoeStoreUsers');

const auth = async (req,res,next) => {
    try {
        const cookieToken = req.cookies.jwt;
        if (!cookieToken) {
            return res.redirect('/login');
        }
        const verifyUser = jwt.verify(cookieToken, process.env.SECRET_KEY);
        console.log(verifyUser);
        const user = await storeUsers.findOne({_id:verifyUser._id});
        console.log(user.email);

        req.cookieToken = cookieToken;
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.redirect("/login");
    }
}


module.exports = auth;