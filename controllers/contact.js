import mongoose from "mongoose";
import Contact from "../models/Contact.js";

const addContact = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    if (!name || !phoneNumber)
      return res.status(400).json({ message: "Required field is missing" });
    const oldContact = await Contact.findOne({ phoneNumber });
    if (oldContact)
      return res
        .status(409)
        .json({ message: "Contact alredy exist with given phone number" });
    const contact = await Contact.create({ name, phoneNumber });
    res
      .status(201)
      .json({ data: contact, message: "Contact Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Conatct is not found" });
    const contact = await Contact.findById(id);
    res
      .status(200)
      .json({ data: contact, message: "Conatct found Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getContacts = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { phoneNumber: { $regex: searchTerm, $options: "i" } },
      ],
    });
    res
      .status(200)
      .json({ data: contacts, message: "Contacts Found successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateContact = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Conatct is not found" });
    const oldContact = await Contact.findOne({
      _id: { $ne: id },
      phoneNumber,
    });
    if (oldContact)
      return res
        .status(409)
        .json({ message: "Contact alredy exist with given phone number" });
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, phoneNumber },
      { new: true }
    );
    res
      .status(200)
      .json({ data: updatedContact, message: "Contact Updated Succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Conatct is not found" });
    await Contact.deleteOne({ _id: id });
    res.status(200).json({ message: "Contact deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export { addContact, getContact, getContacts, updateContact, deleteContact };
