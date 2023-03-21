import Income from '../mongodb/models/income.js';
import User from '../mongodb/models/user.js';

import mongoose from "mongoose";


const getAllIncome = async(req,res) =>{};
const getCurrentIncome = async(req,res) =>{};
const createIncomeStatement = async(req,res) =>{

    console.log(req.body)

    try {
    
        const {user,fiveDollarBills, tenDollarBills, twentyDollarBills, fiftyDollarBills, hundredDollarBills,total,type} = req.body;

         //Start new session for atomic

         const session = await mongoose.startSession();

        session.startTransaction(); //ensures atomic

        const theUser = await User.findOne({user}).session(session);
        if(!user) throw new Error('User not found')

        const newIncomeTransaction = await Income.create({
            fiveDollarBills, 
            tenDollarBills, 
            twentyDollarBills,
            fiftyDollarBills,
            hundredDollarBills,
            total,
            type,
            date: new Date(),


        })
        console.log(newIncomeTransaction)

        //user.allTransactions.push(newTransaction._id);

        await theUser.save({session})
        await session.commitTransaction();
        res.status(200).json({message: 'Income Transaction executed successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }


};

export{
    getAllIncome,
    getCurrentIncome,
    createIncomeStatement
}
