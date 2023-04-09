import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDb from "./mongodb/connect.js";
import userRouter from './routes/user.routes.js';
import billRouter from './routes/bill.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import incomeRouter from './routes/income.routes.js';
import bodyParser from 'body-parser'
import {Server} from "socket.io";


dotenv.config();

const app = express();
import http from "http";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());//{limit: '50mb
app.use('/api/v1/users', userRouter);

app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/income', incomeRouter);
app.use('/api/v1/bills', billRouter);

const server = http.createServer(app);

const io = new Server(server,{

    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST","PUT"]
    }
})



app.get('/', (req,res)=>{
    res.send({message: 'Hello World'});
})

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  
    socket.on('result', (data) => {
      // Handle the image data received from the Raspberry Pi here
      console.log('Image data received:', data);
      io.emit("result", data);
    });
  });


const startServer = async () => {
    try{
        connectDb(process.env.MONGODB_URL);
        server.listen(8080,()=>{//, '192.168.1.129'
            console.log("server listening on port 8080")
        })
    } catch(error) {
        console.log(error);
    }

}


startServer();