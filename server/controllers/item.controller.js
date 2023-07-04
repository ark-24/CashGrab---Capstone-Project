import User from "../mongodb/models/user.js";
import Item from "../mongodb/models/items.js";

import mongoose from "mongoose";

const getItems = async (req, res) => {
    const userId = req.params.userId; 

  try {
    const items = await Item.find({ user: userId }).limit(req.query._end);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {

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
      user,
      date: new Date(),
    });


    await theUser.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "Transaction executed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    const itemToDelete = await Item.findById(id).populate("user");
    if (!itemToDelete) throw new Error("Item not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    await itemToDelete.deleteOne({ session });

    // Commit the transaction before updating the creator
    await session.commitTransaction();
    session.endSession();

    if (itemToDelete.creator) {
      await itemToDelete.creator.save();
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getItems, addItem, deleteItem };
