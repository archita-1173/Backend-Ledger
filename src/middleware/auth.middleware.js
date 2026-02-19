const userModel=require('../models/user.model');
const jwt= require('jsonwebtoken');




async function authMiddleware(req, res, next){
    const token= req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message: 'Unauthorized',
            status:"failed"
        })
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const user= await userModel.findById(decoded.userId);
        req.user= user;
        return next();

    }catch(err){
        return res.status(401).json({
            message: 'Unauthorized',
            status:"failed"
        })
    }


}

async function authSystemUserMiddleware(req,res,next){
    const token= req.cookies.token
}
if(!token){
    return res.status(410).json({
        message: "Unauthorized access,token is missing"

    })

try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await userModel.findById(decoded.userId).select("+systemUser")
}




}


module.exports={ authMiddleware };