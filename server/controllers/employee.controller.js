import User from "../mongodb/models/user.js";
import Employee from "../mongodb/models/employees.js";

import mongoose from "mongoose";

const getEmployees = async (req, res) => {
    const {user} = req.body
  try {
    const employees = await Employee.find({ user }).limit(req.query._end);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addEmployee = async (req, res) => {
  console.log(req.body);

  try {
    const { user, firstName, lastName, phoneNumber, email } = req.body;

    //Start new session for atomic

    const session = await mongoose.startSession();

    session.startTransaction(); //ensures atomic
    const theUser = await User.findOne({ user }).session(session);
    if (!theUser) throw new Error("User not found");

    const newEmployee = await Employee.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      creator: user._id,
      date: new Date(),
    });
    console.log(newEmployee);


    await theUser.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "Transaction executed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getEmployees, addEmployee };
