import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},

    email: {type: String, required: true},
    avatar: {type: String, required: false},
    password: { type: String, required: false, unique: true },
    allTransactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
})


const userModel = mongoose.model('User', UserSchema);

export default userModel;