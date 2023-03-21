import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    moneyDeposited: {type: Number, required: false},
    item: {type: String, required: false},
    details: {type: String, required: false},
    price: {type: Number, required: false},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    customerEmail: {type: String, required: false},
    date: {type: Date, required: true},
})

const transactionModel = mongoose.model('Transaction', TransactionSchema);

export default transactionModel;