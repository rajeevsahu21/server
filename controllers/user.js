import User from "../models/User.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const userData = require("../sample_data.json");

const importUsers = async () => {
  for (let i = 0; i < userData.length; i++) {
    await User.create({
      ...userData[i],
      income: +userData[i].income.substring(1),
      phone_price: +userData[i].phone_price,
    });
  }
};

const getAllusersHavingIncomeLessThan5 = async (req, res) => {
  try {
    const users = await User.find({
      income: { $lt: 5 },
      $or: [{ car: "BMW" }, { car: "Mercedes" }],
    });
    res.status(200).json({ message: "Data Found Successfully", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllMaleUser = async (req, res) => {
  try {
    const users = await User.find({
      gender: "Male",
      phone_price: { $gt: 10000 },
    });
    res.status(200).json({ message: "Data Found Successfully", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsersQuote = async (req, res) => {
  try {
    const users = await User.find({
      last_name: { $regex: /^M.*/ },
      quote: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$quote" }, 15] },
      email: { $regex: (/.*$last_name.*/, "i") },
    });
    res.status(200).json({ message: "Data Found Successfully", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUserWhoseEmailNotIncludeAnyDigit = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ car: "BMW" }, { car: "Mercedes" }, { car: "Audi" }],
      email: { $regex: /^[^\d\s@]+@[^\d\s@]+\.[^\d\s@]+$/ },
    });
    res.status(200).json({ message: "Data Found Succesfully", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTop10CityData = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
          avg_income: { $avg: "$income" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.status(200).json({ message: "Data Found SuccessFully", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  importUsers,
  getAllusersHavingIncomeLessThan5,
  getAllMaleUser,
  getAllUsersQuote,
  getAllUserWhoseEmailNotIncludeAnyDigit,
  getTop10CityData,
};
