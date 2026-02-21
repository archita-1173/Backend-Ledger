const mongoose= require("mongoose")
const transactionModel= require("../models/transaction.model")
const ledgerModel= require("../models/ledger.model")
const accountModel= require("../models/account.model")
const { create } = require("./user.model")




const tokenBlacklistSchema= new mongoose.Schema({

    token:{
        type: String,
        required: [true, 'Token is required'],
        unique: true,
    },  
  
    },{timestamps: true})


    tokenBlacklistSchema.index({createdAt: 1}, {expireAfterSeconds: 3600})

const tokenBlacklistModel= mongoose.model('tokenBlacklist', tokenBlacklistSchema);
module.exports= tokenBlacklistModel;

