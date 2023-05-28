import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    itemName: {type: String, required: false},
    price: {type: Number, required: false},
    date: {type: Date, required: true},

})

const itemModel = mongoose.model('Item', ItemSchema);

export default itemModel;