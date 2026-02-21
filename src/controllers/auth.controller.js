const userModel= require('../models/user.model');
const jwt= require('jsonwebtoken');
const emailService= require('../services/email.service');
const tokenBlacklistModel= require('../models/blacklist.model');

async function userRegisterController(req, res){
    const {email, name, password}= req.body;
    const isExists= await userModel.findOne({
        email:email
    })  
    if(isExists){
        return res.status(400).json({
            message: 'Email already exists',
            status:"failed"
        })
    }

    const user=await userModel.create({
        email,
        name,
        password
    }); 

    const token= jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
    res.cookie('token',token)
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name},
        token,
        message: 'User registered successfully',
        status:"success"
    })
await emailService.sendRegistrationEmail(user.email, user.name);



}

async function userLoginController(req, res){
    const {email, password}= req.body;
    const user= await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json({
            message: 'Invalid email or password',
            status:"failed"
        })



    }
    const isMatch= await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({
            message: 'Invalid email or password',
            status:"failed"
        })
    }
    const token= jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
    res.cookie('token',token)
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name},
        token,
        message: 'User logged in successfully',
        status:"success"
    })
}


async function userLogoutController(req,res){
    const token= req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(400).json({
            message:"Token is missing"
        })
    }
    res.clearCookie('token',"")
    await tokenBlacklistModel.create({token})
    res.status(200).json({
        message:"User logged out successfully",
        status:"success"
    })
}

module.exports={
    userRegisterController,userLoginController,userLogoutController
}