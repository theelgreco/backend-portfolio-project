const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.js");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ msg: "server ok" });
});

app.get("/api/categories", getCategories);

module.exports = app;
