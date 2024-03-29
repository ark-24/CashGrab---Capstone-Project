import Income from '../mongodb/models/income.js';
import User from '../mongodb/models/user.js';
import Bill from '../mongodb/models/bills.js';

import moment from 'moment-timezone';
import mongoose from "mongoose";


const getAllIncome = async(req,res) =>{
  const userId = req.params.userId; 


    try {
        const incomes = await Income.find({user: userId}).limit(req.query._end);
        res.status(200).json(incomes);

        } catch (error) {
        res.status(500).json({message: error.message})
        
    }
};
const getCurrentIncome = async(req,res) =>{};
const createIncomeStatement = async(req,res) =>{


    try {

    
        const {user,fiveDollarBills, tenDollarBills, twentyDollarBills, fiftyDollarBills, hundredDollarBills,transactionTotal,type} = req.body;

         //Start new session for atomic

         const session = await mongoose.startSession();

        session.startTransaction(); //ensures atomic

        const theUser = await User.findOne({user}).session(session);
        if(!user) throw new Error('User not found')

        //const newIncomeTransaction = 
       
      
        const mostRecentBill = await Bill.findOne({}).sort({ date: -1 }).exec();

        if (type === "Withdrawal") {
            const mostRecentBill = await Bill.findOne({}, {}, { sort: { 'date' : -1 } });
          
            const currentCashBalance = mostRecentBill ? mostRecentBill.cashBalance : 0;
            const totalWithdrawalAmount = Number(transactionTotal);
            console.log("l51");
          
            if (currentCashBalance < totalWithdrawalAmount) {
              res.status(500).json({ message: "Insufficient funds" });
              return;
            }

          
            let totalFiveDollarBills = mostRecentBill ? mostRecentBill.totalFiveDollarBills : 0;
            let totalTenDollarBills = mostRecentBill ? mostRecentBill.totalTenDollarBills : 0;
            let totalTwentyDollarBills = mostRecentBill ? mostRecentBill.totalTwentyDollarBills : 0;
            let totalFiftyDollarBills = mostRecentBill ? mostRecentBill.totalFiftyDollarBills : 0;
            let totalHundredDollarBills = mostRecentBill ? mostRecentBill.totalHundredDollarBills : 0;

            if (totalFiveDollarBills < fiveDollarBills) {
              res.status(500).json({ message: "Insufficient bills available to withdraw" });
              return;
            }
            
            if (totalTenDollarBills < tenDollarBills) {
              res.status(500).json({ message: "Insufficient bills available to withdraw" });
              return;
            }

            if (totalTwentyDollarBills < twentyDollarBills) {
              res.status(500).json({ message: "Insufficient bills available to withdraw" });
              return;
            }

            if (totalFiftyDollarBills < fiftyDollarBills) {
              res.status(500).json({ message: "Insufficient bills available to withdraw" });
              return;
            }

            if (totalHundredDollarBills < hundredDollarBills) {
              res.status(500).json({ message: "Insufficient bills available to withdraw" });
              return;
            }

            
          
            let remainingWithdrawalAmount = totalWithdrawalAmount;
          
            while (remainingWithdrawalAmount > 0) {
              if (remainingWithdrawalAmount >= 100 && totalHundredDollarBills > 0) {
                totalHundredDollarBills--;
                remainingWithdrawalAmount -= 100;
              } else if (remainingWithdrawalAmount >= 50 && totalFiftyDollarBills > 0) {
                totalFiftyDollarBills--;
                remainingWithdrawalAmount -= 50;
              } else if (remainingWithdrawalAmount >= 20 && totalTwentyDollarBills > 0) {
                totalTwentyDollarBills--;
                remainingWithdrawalAmount -= 20;
              } else if (remainingWithdrawalAmount >= 10 && totalTenDollarBills > 0) {
                totalTenDollarBills--;
                remainingWithdrawalAmount -= 10;
              } else if (remainingWithdrawalAmount >= 5 && totalFiveDollarBills > 0) {
                totalFiveDollarBills--;
                remainingWithdrawalAmount -= 5;
              } else {
                res.status(500).json({ message: "Insufficient bills to fulfill withdrawal" });
                return;
              }
            }
          
            const newCashBalance = currentCashBalance - totalWithdrawalAmount;
          
            //const newBillTransaction =
             await Bill.create({
              totalFiveDollarBills,
              totalTenDollarBills,
              totalTwentyDollarBills,
              totalFiftyDollarBills,
              totalHundredDollarBills,
              cashBalance: newCashBalance,
              date: new Date(),
              user,
            });
          
          
          } else {
       

        const newBalance = mostRecentBill ? (Number(transactionTotal) + Number(mostRecentBill?.cashBalance)) : Number(transactionTotal);

            //const newBillTransaction = 
        await Bill.create({
            totalFiveDollarBills: mostRecentBill ? Number( mostRecentBill.totalFiveDollarBills) + Number(fiveDollarBills ): Number(fiveDollarBills), 
            totalTenDollarBills: mostRecentBill ? Number(mostRecentBill.totalTenDollarBills) + Number(tenDollarBills) : Number(tenDollarBills),  
            totalTwentyDollarBills: mostRecentBill ? Number(mostRecentBill.totalTwentyDollarBills) + Number(twentyDollarBills) : Number(twentyDollarBills),
            totalFiftyDollarBills: mostRecentBill ? Number(mostRecentBill.totalFiftyDollarBills) + Number(fiftyDollarBills) : Number(fiftyDollarBills),
            totalHundredDollarBills:  mostRecentBill ? Number(mostRecentBill.totalHundredDollarBills) + Number(hundredDollarBills) : Number(hundredDollarBills),
            cashBalance: Number(newBalance),
            date: new Date(),
            user

        })

    }
    await Income.create({
      fiveDollarBills, 
      tenDollarBills, 
      twentyDollarBills,
      fiftyDollarBills,
      hundredDollarBills,
      transactionTotal,
      type,
      user,
      date: new Date(),


  })
        await theUser.save({session})
        await session.commitTransaction();
        res.status(200).json({message: 'Income Transaction executed successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }


};
const getIncomePerDay = async (req, res) => {
  const userId = mongoose.Types.ObjectId.createFromHexString(req.params.userId);
  
  try {
    const startDate = moment().subtract(7, 'days').startOf('day').tz("America/Los_Angeles");
    const endDate = moment().endOf('day').tz("America/Los_Angeles");

    const incomePerDay = await Income.aggregate([
      {
        $match: {
          type: "Deposit",
          user: userId,
          date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: { $subtract: ["$date", 8 * 60 * 60000] } } } },
          totalIncome: { $sum: "$transactionTotal"  },

        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const incomeArray = new Array(7).fill(0);
    incomePerDay.forEach((income, i) => {
      const dayOfWeek = moment().diff( moment(income._id),'days') 
      incomeArray[incomeArray.length-dayOfWeek-1] = income.totalIncome;
    });
    res.json(incomeArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export{
    getAllIncome,
    getCurrentIncome,
    createIncomeStatement,
    getIncomePerDay
}
