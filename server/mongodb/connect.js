import mongoose from "mongoose";
import userModel from "./models/user.js";

const connectDb = async (url) => {
    mongoose.set('strictQuery', true);

    await mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error));
}

export default connectDb;

