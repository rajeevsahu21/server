import express from "express";
import cors from "cors";
import { config } from "dotenv";

import dbConnect from "./config/dbConnect.js";
import contactRoutes from "./routes/contact.js";
import userRoutes from "./routes/user.js";

config();
dbConnect();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is Working" });
});
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
