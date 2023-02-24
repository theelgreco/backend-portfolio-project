exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "invalid review_id") {
    response.status(404).send({ msg: "There is no review with that id" });
  } else if (error === "id is not a number") {
    response.status(400).send({ msg: "ID must be a number!" });
  } else if (error === "No data has been sent") {
    response.status(400).send({ msg: "no data was sent!" });
  } else if (error === "incorrect data type") {
    response.status(400).send({ msg: "votes must be a number!" });
  } else if (error === "invalid category") {
    response.status(400).send({ msg: "That is not a valid category" });
  } else if (error === "comment id does not exist") {
    response.status(404).send({ msg: "There is no comment with that ID" });
  } else if (error === "invalid sort by option") {
    response.status(400).send({ msg: "Invalid sort by option" });
  } else if (error === "invalid order by option") {
    response.status(400).send({ msg: "Invalid order option" });
  } else if (error === "non-existent category") {
    response
      .status(404)
      .send({ msg: "There are no reviews for that category" });
  } else {
    next(error);
  }
};

exports.handlePSQLerrors = (error, request, response, next) => {
  if (error.code === "23502") {
    response.status(400).send({ msg: "incorrect data sent!" });
  } else if (error.code === "22P02") {
    response.status(400).send({ msg: "invalid data type sent" });
  } else {
    next(error);
  }
};

exports.handle500errors = (error, request, response, next) => {
  response.status(500).send({ msg: "server error" });
};
