import { Router } from "express";
import {
  getAllMaleUser,
  getAllusersHavingIncomeLessThan5,
} from "../controllers/user.js";

const router = Router();

router.get("/income", getAllusersHavingIncomeLessThan5);
router.get("/male", getAllMaleUser);

export default router;
