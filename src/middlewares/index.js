import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    const collection = req.app.locals.mongoConnection.getCollection("users");
    const user = await collection.findOne({ _id: decoded._id });

    if (!user || user.blocked) {
      return res.status(401).json({ error: "Account is blocked or not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function authorize(allowedRoles, allowOwner = false) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isRoleAllowed = allowedRoles.includes(req.user.role);
    const isOwner = allowOwner && req.user._id === req.params.email;

    if (!isRoleAllowed && !isOwner) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
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
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
}

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

export const movieRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: (req) => (req.user.role === "USER" ? 5 : 100),
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
