const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers/controllers.js");
const {
  handle500errors,
} = require("./controllers/error-handling-controllers.js");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found!" });
});

app.use(handle500errors);

module.exports = app;
