import express from "express";
import { authenticate, authorize } from "../middlewares/index.js";
import {
  addFavorite,
  getUserFavorites,
  updateFavorite,
  deleteFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/", authenticate, authorize(["PREMIUM_USER"]), addFavorite);

router.get(
  "/:email",
  authenticate,
  authorize(["PREMIUM_USER"]),
  getUserFavorites
);

router.delete("/", authenticate, authorize(["PREMIUM_USER"]), deleteFavorite);

router.put("/", authenticate, authorize(["PREMIUM_USER"]), updateFavorite);

export default router;
