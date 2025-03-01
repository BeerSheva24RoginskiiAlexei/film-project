import dotenv from "dotenv";
dotenv.config();

export default class FavoriteService {
  constructor(mongoConnection) {
    this.collection = mongoConnection.getCollection("favorites");
  }
  async addFavorite(email, movieId, feed_back, viewed) {
    try {
      const existingFavorite = await this.collection.findOne({
        email,
        movieId,
      });

      if (existingFavorite) {
        throw new Error("This movie is already in favorites");
      }

      const favorite = { email, movieId, feed_back, viewed };
      const result = await this.collection.insertOne(favorite);

      return { _id: result.insertedId, ...favorite };
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw {
        code: error.code || 500,
        message: error.message || "Failed to add favorite",
      };
    }
  }

  async getUserFavorites(email) {
    try {
      const favorites = await this.collection.find({ email }).toArray();
      return favorites;
    } catch (error) {
      console.error("Error getting user favorites:", error);
      throw new Error("Failed to get user favorites");
    }
  }

  async deleteFavorite(email, movieId) {
    console.log(email, movieId);
    try {
      const result = await this.collection.findOneAndDelete({
        email,
        movieId: movieId,
      });

      if (result.value) {
        throw new Error("Favorite not found");
      }

      return { message: "Favorite deleted successfully" };
    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw new Error("Failed to delete favorite");
    }
  }

  async updateFavorite(email, movieId, feed_back, viewed) {
    try {
      await this.collection.updateOne(
        { email, movieId },
        {
          $set: {
            feed_back,
            viewed,
          },
        }
      );
      
      const updatedFavorite = await this.collection.findOne({ email, movieId });

      if (!updatedFavorite) {
        throw new Error("Favorite not found");
      }

      return updatedFavorite;
    } catch (error) {
      console.error("Error updating favorite:", error);
      throw new Error("Failed to update favorite");
    }
  }
}
