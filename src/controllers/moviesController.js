import MovieService from "../services/movieService.js";

let movieService;

export function initMovieService(db) {
  movieService = new MovieService(db);
}

export async function getPopularMovie(req, res) {
  try {
    const { year, actor, genres, language, amount, title, page } = req.query;
    
    const limit = amount ? Number(amount) : 9;
    const pageNumber = page ? Number(page) : 1;

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: "'amount' must be a positive number" });
    }
    
    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ error: "'page' must be a positive number" });
    }

    const movies = await movieService.getPopularMovies(
      year ? Number(year) : undefined,
      actor,
      genres ? genres.split(",") : undefined,
      language,
      title,
      limit,  
      pageNumber
    );

    const totalMovies = await movieService.getMoviesCount(
      year ? Number(year) : undefined,
      actor,
      genres ? genres.split(",") : undefined,
      language,
      title
    );

    const response = {
      movies,
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limit,
        totalItems: totalMovies,
        totalPages: Math.ceil(totalMovies / limit)
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting popular movies:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getCommentedMovie(req, res) {
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
    res.status(200).json({
      message: "Movie rating updated successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Error updating movie rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllMovies(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 20, 1);

    const movies = await movieService.getAllMovies(pageNumber, limitNumber);
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching all movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllMovieMetadata(req, res) {
  try {
    const metadata = await movieService.getAllMovieMetadata();
    res.status(200).json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error("Error fetching movie metadata:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}
