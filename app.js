const express = require("express");
const app = express();
const {
  getCategories,
  getReviewsById,
} = require("./controllers/controllers.js");
const {
  handleCustomErrors,
  handle500errors,
} = require("./controllers/error-handling-controllers");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found!" });
});

app.use(handleCustomErrors);
app.use(handle500errors);

module.exports = app;
