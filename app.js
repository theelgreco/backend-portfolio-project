const express = require("express");
const app = express();
const cors = require("cors");
const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postComment,
  getUsers,
  patchReview,
  deleteComment,
  getEndpoints,
  invalidPath,
} = require("./controllers/controllers.js");
const {
  handleCustomErrors,
  handlePSQLerrors,
  handle500errors,
} = require("./controllers/error-handling-controllers");

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postComment);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReview);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", invalidPath);

app.use(handleCustomErrors);
app.use(handlePSQLerrors);
app.use(handle500errors);

module.exports = app;
