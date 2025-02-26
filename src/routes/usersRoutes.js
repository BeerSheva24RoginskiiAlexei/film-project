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

const router = express.Router();

router.post("/signup", createUser);

router.put("/updaterole", updateRole);

router.put("/updatepassword", updatePassword)

router.get("/:email", getAccount);

router.post("/login", login);

router.put("/:email/block", blockUser);

router.put("/:email/unblock", unblockUser);

router.delete("/:email/delete", deleteUser);

export default router;
