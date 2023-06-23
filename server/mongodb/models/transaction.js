import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    moneyDeposited: {type: Array, required: false},
    selectedItems: [
        {
          item: { type: String, required: false },
          count: { type: Number, required: false },
        },
      ],
    details: {type: String, required: false},
    price: {type: Number, required: false},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    customerEmail: {type: String, required: false},
    date: {type: Date, required: true},
})

const transactionModel = mongoose.model('Transaction', TransactionSchema);

export default transactionModel;