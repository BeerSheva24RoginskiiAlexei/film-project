import express from "express";
import {
  createUser,
  updateRole,
  getAccount,
  login,
  blockUser,
  unblockUser,
  deleteUser,
  updatePassword,
} from "../controllers/usersController.js";
import { authenticate, authorize } from "../middlewares/index.js";

const router = express.Router();

router.post("/signup", createUser);

router.put("/updaterole", authenticate, authorize(["ADMIN"]), updateRole);

router.put("/updatepassword", authenticate, updatePassword);

router.get("/:email", authenticate, getAccount);

router.post("/login", login);

router.put("/:email/block", authenticate, authorize(["ADMIN"]), blockUser);

router.put("/:email/unblock", authenticate, authorize(["ADMIN"]), unblockUser);

router.delete("/:email", authenticate, authorize(["ADMIN"], true), deleteUser);

export default router;
