import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    totalFiveDollarBills: {type: Number, required: false},
    totalTenDollarBills: {type: Number, required: false},
    totalTwentyDollarBills: {type: Number, required: false},
    totalFiftyDollarBills: {type: Number, required: false},
    totalHundredDollarBills: {type: Number, required: false},
    cashBalance: {type: Number, required: false},
    date: {type: Date, required: true},

})

const billModel = mongoose.model('Bill', BillSchema);

export default billModel;