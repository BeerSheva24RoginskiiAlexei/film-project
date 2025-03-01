import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET;



export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

export function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role === "ADMIN") {
      return res
        .status(403)
        .json({ error: "Admins are not allowed to access this resource" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't have access" });
    }

    next();
  };
}

export function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((e) => e.message) });
    }

    next();
  };
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

export const movieRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

export function limitForNonAdmins(req, res, next) {
  if (req.user.role === "ADMIN") {
    return next();
  }

  movieRateLimit(req, res, next);
}

export function validateRating(req, res, next) {
  const { rating } = req.body;

  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    return res
      .status(400)
      .json({ error: "Rating must be a number between 1 and 10" });
  }

  next();
}

// export const checkCommentDeletePermissions = async (req, res, next) => {
//   try {
//     const { commentId, email } = req.body; 
//     const { role } = req.user; 

//     if (!commentId || !email || !role) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const objectId = new ObjectId(commentId);

//     const comment = await req.db.collection("comments").findOne({ _id: objectId });
//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     if (req.user.role === "ADMIN") {
//       next();
//     } else if (req.user.role === "PREMIUM_USER" && comment.email === email) {
//       next();
//     } else {
//       return res.status(403).json({ message: "Forbidden: You do not have permission to delete this comment" });
//     }
//   } catch (error) {
//     console.error("Error in checkCommentDeletePermissions middleware:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
