exports.handle500errors = (error, request, response, next) => {
  response.status(500).send({ msg: "server error" });
};
