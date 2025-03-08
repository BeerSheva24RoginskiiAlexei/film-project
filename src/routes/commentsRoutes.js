import express from "express";
import {
  getMovieComments,
  addComment,
  getUserComments,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { authenticate, authorize } from "../middlewares/index.js";

const router = express.Router();

router.get("/:movie_id", authenticate, getMovieComments);

router.get("/user/:email", authenticate, getUserComments);

router.post("/", authenticate, authorize(["PREMIUM_USER"]), addComment);

router.put("/", authenticate, authorize(["PREMIUM_USER"], true), updateComment);

router.delete(
  "/:commentId",
  authenticate,
  authorize(["PREMIUM_USER", "ADMIN"], true),
  deleteComment
);

export default router;
