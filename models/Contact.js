import mongoose from "mongoose";

const contactScema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlegth: 3,
      required: [true, "Name is Required"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone Number is Required"],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactScema);

export default Contact;
