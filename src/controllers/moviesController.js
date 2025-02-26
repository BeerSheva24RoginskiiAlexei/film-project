import MovieService from "../services/movieService.js";

let movieService;

export function initMovieService(db) {
  movieService = new MovieService(db);
}

export async function getPopularMovie(req, res) {
  try {
    const { year, actor, genres, language, amount } = req.query;

    const movies = await movieService.getPopularMovies(
      year ? Number(year) : undefined,
      actor,
      genres ? genres.split(",") : undefined,
      language,
      amount ? Number(amount) : 10
    );

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error getting popular movies:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getCommentedMovie(req, res) {
  console.log("test");
  try {
    const { year, actor, genres, language, amount } = req.query;
    const movies = await movieService.getCommentedMovie(
      year ? Number(year) : undefined,
      actor,
      genres ? genres.split(",") : undefined,
      language,
      amount ? Number(amount) : 10
    );

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error getting popular movies:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getMovieById(req, res) {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function rateMovie(req, res) {
  const { imdbId, rating } = req.body;

  try {
    const newRating = await movieService.addRate(imdbId, rating); 
    res
      .status(200)
      .json({
        message: "Movie rating updated successfully",
        rating: newRating,
      }); 
  } catch (error) {
    console.error("Error updating movie rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
