exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "invalid review_id") {
    response.status(404).send({ msg: "There is no user with that id" });
  } else if (error === "id is not a number") {
    response.status(400).send({ msg: "ID must be a number!" });
  } else {
    next(error);
  }
};

exports.handle500errors = (error, request, response, next) => {
  response.status(500).send({ msg: "server error" });
};
