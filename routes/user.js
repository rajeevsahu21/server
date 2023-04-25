import { Router } from "express";
import {
  getAllMaleUser,
  getAllUserWhoseEmailNotIncludeAnyDigit,
  getAllUsersQuote,
  getAllusersHavingIncomeLessThan5,
  getTop10CityData,
} from "../controllers/user.js";

const router = Router();

router.get("/income", getAllusersHavingIncomeLessThan5);
router.get("/male", getAllMaleUser);
router.get("/quote", getAllUsersQuote);
router.get("/email", getAllUserWhoseEmailNotIncludeAnyDigit);
router.get("/city", getTop10CityData);

export default router;
