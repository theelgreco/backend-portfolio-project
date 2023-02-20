exports.handle404errors = (error, request, response, next) => {
  if (error.status === 404) {
    response.status(404).send({ msg: "not found" });
  } else {
    next(error);
  }
};

exports.handle500errors = (error, request, response, next) => {
  if (error.status === 500) {
    response.status(500).send({ msg: "server error" });
  }
};
