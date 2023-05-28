import User from "../mongodb/models/user.js";
import Item from "../mongodb/models/items.js";

import mongoose from "mongoose";

const getItems = async (req, res) => {
    const {user} = req.body
  try {
    const employees = await Item.find({ user }).limit(req.query._end);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  console.log(req.body);

  try {
    const { user, itemName, price } = req.body;

    //Start new session for atomic

    const session = await mongoose.startSession();

    session.startTransaction(); //ensures atomic
    const theUser = await User.findOne({ user }).session(session);
    if (!theUser) throw new Error("User not found");

    const newItem = await Item.create({
      itemName,
      price,
      creator: user._id,
      date: new Date(),
    });
    console.log(newItem);


    await theUser.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "Transaction executed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getItems, addItem };
