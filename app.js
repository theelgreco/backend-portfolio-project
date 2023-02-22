const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postComment,
  patchReview,
} = require("./controllers/controllers.js");
const {
  handleCustomErrors,
  handlePSQLerrors,
  handle500errors,
} = require("./controllers/error-handling-controllers");
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReview);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found!" });
});

app.use(handleCustomErrors);
app.use(handlePSQLerrors);
app.use(handle500errors);

module.exports = app;
