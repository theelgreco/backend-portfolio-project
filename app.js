const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.js");

app.get("/api/categories", getCategories);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found!" });
});

module.exports = app;
