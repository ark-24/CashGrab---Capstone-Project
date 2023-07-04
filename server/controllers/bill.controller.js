import Bill from '../mongodb/models/bills.js';
import User from '../mongodb/models/user.js';

import mongoose from "mongoose";


const getCurrentBillStatement = async(req,res) =>{
    const userId = req.params.userId; 


    try {

        const recentBills = await Bill.findOne({user: userId}).sort({ date: -1 }).exec();
        res.status(200).json(recentBills);

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
};


const createBillStatement = async(req,res) =>{

    try {
    
        const {fiveDollarBills, tenDollarBills, twentyDollarBills, fiftyDollarBills, hundredDollarBills, user} = JSON.stringify(req.body);

         //Start new session for atomic

         const session = await mongoose.startSession();

        session.startTransaction(); //ensures atomic

        const theUser = await User.findOne({user}).session(session);
        if(!user) throw new Error('User not found')
        
        const newBalance = mostRecentTransaction ? (transactionTotal + mostRecentTransaction.cashBalance) : transactionTotal;
        // await Bill.deleteMany({})

        const newBillTransaction = await Bill.create({
            fiveDollarBills, 
            tenDollarBills, 
            twentyDollarBills,
            fiftyDollarBills,
            hundredDollarBills,
            transactionTotal,
            type,
            user,
            cashBalance: newBalance,
            date: new Date(),


        })

        //user.allTransactions.push(newTransaction._id);

        await theUser.save({session})
        await session.commitTransaction();
        res.status(200).json({message: 'Income Transaction executed successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }


};

export{
    getCurrentBillStatement,
    createBillStatement
}