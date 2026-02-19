const transactionModel= require('../models/transaction.model')
const ledgerModel= require("../models/ledger.model");
const mongoose=require("mongoose")
const emailService=require("../services/email.service")
const accountModel=require("../models/account.model")

async function createTransaction(req,res){
    const{fromAccount, toAccount, amount, idempotencyKey}= req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
       return  res.status(400).json({
           message :"FromAccount, toAccount, amount, idempotencyKey are required"
        })
    }

    const fromUserAccount= await accountModel.findOne({_id:fromAccount})


    const toUserAccount= await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount||!toUserAccount){
        return res.status(404).json({
            message:"Invalid fromAccount or toAccount"
        })
    }


//idempotency key
const isTransactionAlreadyExists=await transactionModel.findOne({
    idempotencyKey:idempotencyKey
})
if(isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status=="COMPLETED"){
        return res.status(200).json({
            message:"Transaction already processed"
            ,transaction: isTransactionAlreadyExists
        })
    }
    if(isTransactionAlreadyExists.status=="PENDING"){
       return res.status(200).json({
            message:"Transaction is still processing"

        })
    }

    if(isTransactionAlreadyExists.status=="FAILED"){
        return res.status(200).json({
            message:"Transaction is still failed"
            
        })
    }
    if(isTransactionAlreadyExists.status=="REVERSED"){
       return res.status(500).json({
            message:"Transaction was reveresd"
        })
    }

}


//check account status

if(fromUserAccount.status!=="ACTIVE" || toUserAccount.status!=="ACTIVE"){
    return res.status(400).json({
        message:"both fromAccount and toAccount must be active"
    })
}

// derive sender balance from ledger
  const balance= await fromUserAccount.getBalance()

  if(balance<amount){
   return  res.status(400).json({
        message: `insufficient balance. current balance is ${balance} and amount is ${amount}`
    })
  
}

//create transaction--pending

const session= await mongoose.startSession()
session.startTransaction() //sabkuch complete hoga ya kuch nhi from mongodb

const transaction=await transactionModel.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
},{session})


const debitLedgerEntry= await ledgerModel.create({
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT",
},{session})

const creditLedgerEntry=await ledgerModel.create({
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
},{session})

transaction.status="COMPLETED"
await transaction.save({session})

await session.commitTransaction()
session.endSession()

//email notification

await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)// because we are usong auth middleware
return res.status(201).json({
    message:"Transaction completed successfully"
    ,transaction:transaction
})

}

async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body

    if(!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"toAccount,amount and idempotencyKey are req"
        })
    }

    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
message:"invalid account"
        })
    }


    const fromUserAccount=await accountModel.findOne({
        systemUser:true,
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }


    const session= await mongoose.startSession()
    session.startTransaction()

    const transaction= await transactionModel.create({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING",

    },{session})


    const creditLedgerEntry= await ledgerModel.create({
        account: toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT",
    },{session})



    const debitLedgerEntry= await ledgerModel.create({
        account: fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT",
    },{session})



    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"initial funds transaction"
        ,transaction:transaction
    })






}

module.exports={
    createTransaction,createInitialFundsTransaction
}

