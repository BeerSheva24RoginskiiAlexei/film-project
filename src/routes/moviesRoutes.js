import express from "express";
import {
  getPopularMovie,
  getCommentedMovie,
  rateMovie,
  getMovieById,
} from "../controllers/moviesController.js";
import {
  authenticate,
  authorize,
  limitForNonAdmins,
  validateRating,
} from "../middlewares/index.js";

const router = express.Router();

router.get(
  "/popular",
  authenticate,
  authorize(["USER", "PREMIUM_USER"]),
  getPopularMovie
);

router.get(
  "/commented",
  authenticate,
  authorize(["USER", "PREMIUM_USER"]),
  getCommentedMovie
);

router.get("/:id", authenticate, limitForNonAdmins, getMovieById);

router.put("/rate", validateRating, rateMovie);

export default router;
