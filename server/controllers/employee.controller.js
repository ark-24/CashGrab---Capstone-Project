import User from "../mongodb/models/user.js";
import Employee from "../mongodb/models/employees.js";

import mongoose from "mongoose";

const getEmployees = async (req, res) => {
    const userId = req.params.userId; 

  try {
    const employees = await Employee.find({ user: userId }).limit(req.query._end);
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
      user: user,
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



const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;

    const employeeToDelete = await Employee.findById(id).populate("user");
    if (!employeeToDelete) throw new Error("Employee not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    await employeeToDelete.deleteOne({ session });

    // Commit the transaction before updating the creator
    await session.commitTransaction();
    session.endSession();

    if (employeeToDelete.creator) {
      await employeeToDelete.creator.save();
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getEmployees, addEmployee,deleteEmployee };
