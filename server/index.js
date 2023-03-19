import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDb from "./mongodb/connect.js";
import userRouter from './routes/user.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import incomeRouter from './routes/income.routes.js';
import bodyParser from 'body-parser'

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());//{limit: '50mb
app.use('/api/v1/users', userRouter);

app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/income', incomeRouter);




app.get('/', (req,res)=>{
    res.send({message: 'Hello World'});
})


const startServer = async () => {
    try{
        connectDb(process.env.MONGODB_URL);
        app.listen(8080, ()=>{
            console.log("server listening on port 8080")
        })
    } catch(error) {
        console.log(error);
    }

}

startServer();