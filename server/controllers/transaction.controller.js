import Transaction from '../mongodb/models/transaction.js';
import User from '../mongodb/models/user.js';


import mongoose from "mongoose";

const getAllTransactions = async(req,res) =>{
    try {
        const transactions = await Transaction.find({}).limit(req.query._end);
        res.status(200).json(transactions);

        } catch (error) {
        res.status(500).json({message: error.message})
        
    }
};
const getTransactionDetail = async(req,res) =>{};


const createTransaction = async (req,res) =>{
    console.log(req.body)

    try {
    
        const {moneyDeposited, item, price, details, customerEmail} = req.body;

         //Start new session for atomic

         const session = await mongoose.startSession();

        session.startTransaction(); //ensures atomic

        const user = await User.findOne({customerEmail}).session(session);
        if(!user) throw new Error('User not found')

        const newTransaction = await Transaction.create({
         item, 
         price, 
         moneyDeposited,
         details,
         customerEmail,
         creator: user._id,
         date: new Date(),

        })
        console.log(newTransaction)

        user.allTransactions.push(newTransaction._id);

        await user.save({session})
        await session.commitTransaction();
        res.status(200).json({message: 'Transaction executed successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }

};
const updateTransaction = async(req,res) =>{};
const deleteTransaction = async(req,res) =>{};


export{
    getAllTransactions,
    getTransactionDetail,
    createTransaction,
    updateTransaction,
    deleteTransaction,
}