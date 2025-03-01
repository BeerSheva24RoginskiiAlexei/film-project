import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();

export default class CommentsService {
  constructor(mongoConnection) {
    this.collection = mongoConnection.getCollection("comments");
  }
  async getMovieComment(movie_id) {
    try {
      const objectId = new ObjectId(movie_id);
      const comments = await this.collection
        .find({ movie_id: objectId })
        .toArray();
      return comments;
    } catch (error) {
      console.error("Error fetching movie comments", error);
      throw error;
    }
  }

  async getUserComments(email) {
    try {
      const comments = await this.collection.find({ email: email }).toArray();
      return comments;
    } catch (error) {
      console.error("Error fetching movie comments", error);
      throw error;
    }
  }

  async addComment(email, movie_id, text) {
    try {
      const newComment = {
        email: email,
        movie_id: new ObjectId(movie_id),
        text: text,
        createdAt: new Date(),
      };

      const result = await this.collection.insertOne(newComment);

      const insertedComment = await this.collection.findOne({
        _id: result.insertedId,
      });
      return insertedComment;
    } catch (error) {
      console.error("Error adding comment", error);
      throw error;
    }
  }

  async updateComment(commentId, email, text) {
    try {
      const objectId = new ObjectId(commentId);
      await this.collection.updateOne(
        { _id: objectId, email: email },
        { $set: { text: text } }
      );

      const updatedComment = await this.collection.findOne({
        _id: objectId,
        email: email,
      });
      return updatedComment;
    } catch (error) {
      console.error("Error updating comment", error);
      throw error;
    }
  }

  async deleteComment(commentId, email) {
    try {
      const objectId = new ObjectId(commentId);
      await this.collection.deleteOne({ _id: objectId, email: email });
    } catch (error) {
      console.error("Error deleting comment", error);
      throw error;
    }
  }
}
