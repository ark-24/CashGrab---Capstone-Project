import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import connectDb from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import billRouter from "./routes/bill.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import incomeRouter from "./routes/income.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import itemRouter from "./routes/item.routes.js";
import manageRouter from "./routes/management.routes.js";
import bodyParser from "body-parser";
import { Server } from "socket.io";

dotenv.config();

const app = express();
import http from "http";
import { log } from "console";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); //{limit: '50mb
app.use("/api/v1/users", userRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/management", manageRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/income", incomeRouter);
app.use("/api/v1/bills", billRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

io.on("connection", (socket) => {
  // console.log('Socket connected:', socket.id);

  socket.on("result", (data) => {
    io.emit("result", data);
  });

  socket.on("image", function (data) {
    var frame = Buffer.from(data, "base64").toString();
    io.emit("image", frame);
  });

  socket.on("json", (data) => {
    // Handle the image data received from the Raspberry Pi here
    console.log("transaction data received:", data);
    io.emit("json", data);
  });
});

//   socket.emit("result",{state:1, cost:data.price})

const startServer = async () => {
  try {
    connectDb(process.env.MONGODB_URL);
    // connectDb('mongodb://127.0.0.1:27017/CashGrab');
    // mongoose.connect(
    //   "mongodb://127.0.0.1:27017/CashGrab")
    //   .then((result) => console.log(result))
    //   .catch(err => console.log(err))
    server.listen(8080, () => {
      console.log("server listening on port 8080");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
