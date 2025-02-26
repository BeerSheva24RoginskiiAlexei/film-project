import express from "express";
import dotenv from "dotenv";
import MongoConnection from "../src/connection/MongoConnection.js";
import userRoutes from "./routes/usersRoutes.js";
import movieRoutes from "./routes/moviesRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import { errorHandler, rateLimiter } from "./middlewares/index.js";
import { initUserService } from "./controllers/usersController.js";
import { initMovieService } from "./controllers/moviesController.js";
import { initFavoriteService } from "./controllers/favoriteController.js";

dotenv.config();
const app = express();
const { MONGO_CONNECTION, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;
const connectionString = `${MONGO_CONNECTION}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`;
const mongoConnection = new MongoConnection(connectionString, "sample_mflix");

async function startServer() {
  try {
    await mongoConnection.connect();
    console.log("Connected to MongoDB");

    initUserService(mongoConnection);
    initMovieService(mongoConnection);
    initFavoriteService(mongoConnection);

    app.use(express.json());
    app.use(rateLimiter);

    app.use("/api/users", userRoutes);
    app.use("/api/movies", movieRoutes);
    app.use("/api/favorites", favoriteRoutes);
    app.use(errorHandler);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
}

startServer();
