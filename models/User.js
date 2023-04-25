import mongoose from "mongoose";

const userScema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: [true, "id is Required"],
    },
    first_name: {
      type: String,
      trim: true,
      minlegth: 3,
      required: [true, "First Name is Required"],
    },
    last_name: {
      type: String,
      trim: true,
      minlegth: 3,
      required: [true, "Last Name is Required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is Required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is Required"],
    },
    income: {
      type: Number,
      required: [true, "Income is Required"],
    },
    city: {
      type: String,
      required: [true, "City is Required"],
    },
    car: {
      type: String,
      required: [true, "Car is Required"],
    },
    quote: {
      type: String,
      required: [true, "Quote is Required"],
    },
    phone_price: {
      type: Number,
      required: [true, "Phone price is Required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userScema);

export default User;
