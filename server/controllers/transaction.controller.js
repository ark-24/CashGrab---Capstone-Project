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

const getRecentTransaction = async(req,res) =>{
    try {
        const transaction = await Transaction.findOne({}).sort({ date: -1 }).exec();
        //console.log(transaction);
        res.status(200).json(transaction);

        } catch (error) {
        res.status(500).json({message: error.message})
        
    }
};

const getTransactionDetail = async(req,res) =>{};


const createTransaction = async (req,res) =>{
    console.log(req.body)

    try {
    
        const {moneyDeposited, selectedItems, price, details, customerEmail} = req.body;

         //Start new session for atomic

         const session = await mongoose.startSession();

        session.startTransaction(); //ensures atomic

        const user = await User.findOne({customerEmail}).session(session);
        if(!user) throw new Error('User not found')

        const newTransaction = await Transaction.create({
         selectedItems, 
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
const updateTransaction = async (req, res) => {
    try {
      const { moneyDeposited, id } = req.body;
  
      if (!id) {
        throw new Error('Missing transaction ID');
      }
  
      if (!moneyDeposited || !Array.isArray(moneyDeposited)) {
        throw new Error('Invalid moneyDeposited value');
      }
  
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { moneyDeposited },
        { new: true } // return the updated document
      );
  
      if (!updatedTransaction) {
        throw new Error('Transaction not found');
      }
  
      res.json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteTransaction = async (req, res) => {
    try {
      const id = req.params.id;
  
      const transactionToDelete = await Transaction.findById(id).populate(
        "creator"
      );
  
      if (!transactionToDelete) throw new Error("Transaction not found");
  
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await transactionToDelete.deleteOne({ session });
      transactionToDelete.creator.allTransactions.pull(transactionToDelete);
  
      await transactionToDelete.creator.save({ session });
      await session.commitTransaction();
  
      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export{
    getAllTransactions,
    getTransactionDetail,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getRecentTransaction,
}