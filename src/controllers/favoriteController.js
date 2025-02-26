import FavoriteService from "../services/favoriteService.js";

let favoriteService;

export function initFavoriteService(db) {
  favoriteService = new FavoriteService(db);
}

export async function addFavorite(req, res) {
  try {
    const { email, movieId, feed_back, viewed = false } = req.body;

    if (!email || !movieId) {
      return res.status(400).json({ error: "Email and movieId are required" });
    }

    const favorite = await favoriteService.addFavorite(
      email,
      movieId,
      feed_back,
      viewed
    );
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 409) {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
}

export async function getUserFavorites(req, res) {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const favorites = await favoriteService.getUserFavorites(email);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
}

export async function deleteFavorite(req, res) {
  try {
    const { email, movieId } = req.body;
    console.log(`deleting ${movieId} from ${email}`);
    if (!email || !movieId) {
      return res.status(400).json({ error: "Email and movieId are required" });
    }

    await favoriteService.deleteFavorite(email, movieId);
    res.json({ message: "Favorite deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete favorite" });
  }
}

export async function updateFavorite(req, res) {
  try {
    const { email, movieId, viewed, feed_back } = req.body;

    if (!email || !movieId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: email and movieId" });
    }

    const updatedFavorite = await favoriteService.updateFavorite(
      email,
      movieId,
      viewed,
      feed_back
    );

    res.json(updatedFavorite);
  } catch (error) {
    res.status(500).json({ error: "Failed to update favorite" });
  }
}
