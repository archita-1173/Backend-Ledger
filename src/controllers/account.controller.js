const accountModel= require('../models/account.model');


async function createAccountController(req,res){
    const user=req.user;


    const account =await accountModel.create({
        user: user._id,


    })

    res.status(201).json({
        account,
        message: 'Account created successfully',
        status:"success"
    })
}

async function getAccountsController(req,res){

    const accounts= await accountModel.find({
        user:req.user._id
    })

    res.status(200).json({
        accounts,
        message:"Accounts retrieved successfully",
        status:"success"
    })

}

async function getAccountBalanceController(req,res){
    const {accountId}= req.params;
    const account= await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        return res.status(404).json({
            message:"Account not found"
        })
    }

    const balance= await account.getBalance()

    res.status(200).json({
        account,
        balance,
        message:"Account balance retrieved successfully",
        status:"success"
    })

}

module.exports={ createAccountController, getAccountsController, getAccountBalanceController }