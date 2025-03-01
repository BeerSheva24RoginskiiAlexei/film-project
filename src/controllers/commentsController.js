import CommentsService from "../services/commentsService.js";

let commentService;

export function initCommentService(db) {
  commentService = new CommentsService(db);
}

export async function getMovieComments(req, res) {
  try {
    const { movie_id } = req.params;
    const comments = await commentService.getMovieComment(movie_id);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching movie comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserComments(req, res) {
  try {
    const { email } = req.params;
    const comments = await commentService.getUserComments(email);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addComment(req, res) {
  try {
    const { email, movie_id, text } = req.body;

    if (!email || !movie_id || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newComment = await commentService.addComment(email, movie_id, text);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateComment(req, res) {
  try {
    const { commentId, email, text } = req.body;

    if (!commentId || !email || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedComment = await commentService.updateComment(
      commentId,
      email,
      text
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteComment(req, res) {
  try {
    const { commentId, email } = req.body;

    if (!commentId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const deletedComment = await commentService.deleteComment(commentId, email);
    res.status(200).json(deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
