import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false},
    fiveDollarBills: {type: Number, required: false},
    tenDollarBills: {type: Number, required: false},
    twentyDollarBills: {type: Number, required: false},
    fiftyDollarBills: {type: Number, required: false},
    hundredDollarBills: {type: Number, required: false},
    transactionTotal: {type: Number, required: false},
    //cashBalance: {type: Number, required: false},
    type:{type: String, required: true},
    date: {type: Date, required: true},

})

const incomeModel = mongoose.model('Income', IncomeSchema);

export default incomeModel;