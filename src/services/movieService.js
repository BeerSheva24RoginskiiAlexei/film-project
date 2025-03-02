import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();

export default class MovieService {
  constructor(mongoConnection) {
    this.collection = mongoConnection.getCollection("movies");
  }

  async getPopularMovies(year, actor, genres, language, amount, title) {
    const filter = {};

    if (year) {
      filter.year = year;
    }

    if (actor) {
      filter.cast = actor;
    }

    if (genres) {
      filter.genres = { $in: [genres] };
    }

    if (language) {
      filter.languages = { $in: [language] };
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const movies = await this.collection
      .find(filter)
      .sort({ "imdb.rating": -1 })
      .limit(amount)
      .toArray();

    return movies;
  }
  async getCommentedMovie(year, actor, genres, language, amount) {
    console.log("Fetching commented movies...");
    const filter = {};
    if (year) filter.year = year;
    if (actor) filter.cast = actor;
    if (genres) filter.genres = { $in: [genres] };
    if (language) filter.languages = { $in: [language] };

    const movies = await this.collection
      .find(filter)
      .sort({ num_mflix_comments: -1 })
      .limit(amount)
      .toArray();

    console.log("Fetched movies:", movies.length);
    return movies;
  }
  async getMovieById(id) {
    try {
      const objectId = new ObjectId(id);
      const movie = await this.collection.findOne({ _id: objectId });

      if (!movie) {
        throw new Error(`Movie with ID ${id} not found`);
      }

      return movie;
    } catch (error) {
      console.error("Error fetching movie by ID:", error.message);
      throw new Error(`Failed to fetch movie: ${error.message}`);
    }
  }
  async addRate(imdbId, rating) {
    const movie = await this.collection.findOne({ imdbId });
    if (!movie) {
      throw new Error("Movie not found");
    }
    const currentRating = movie.imdb.rating || 0;
    const currentVotes = movie.imdb.votes || 0;

    const newRating =
      (currentRating * currentVotes + rating) / (currentVotes + 1);
    const updateResult = await this.collection.updateOne(
      { imdbId },
      {
        $set: {
          rating: newRating,
        },
        $inc: {
          votes: 1,
        },
      }
    );

    if (updateResult.modifiedCount > 0) {
      return newRating;
    }

    throw new Error("Failed to update the movie rating");
  }

  async getAllMovies(page, limit) {
    const skip = (page - 1) * limit;

    const totalCount = await this.collection.countDocuments();

    const totalPages = Math.ceil(totalCount / limit);

    const movies = await this.collection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      movies,
      totalPages,
      totalCount,
    };
  }
}
