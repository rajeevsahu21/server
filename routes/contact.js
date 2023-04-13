import { Router } from "express";
import {
  addContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from "../controllers/contact.js";

const router = Router();

router.post("/", addContact);
router.get("/:id", getContact);
router.get("/", getContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
