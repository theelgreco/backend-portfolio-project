const {
  selectCategories,
  selectReviews,
  selectReviewsById,
  insertComments,
  selectComments,
  selectUsers,
  updateReview,
  removeComment,
  readEndpoints,
} = require("../models/models.js");

exports.getEndpoints = (request, response, next) => {
  readEndpoints()
    .then((result) => {
      const parsedEndpoints = JSON.parse(result);
      const endpoints = { endpoints: parsedEndpoints };
      response.status(200).send(endpoints);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query;

  const categoryPromise = selectCategories(category);
  const reviewsPromise = selectReviews(category, sort_by, order);

  Promise.all([categoryPromise, reviewsPromise])
    .then((result) => {
      reviews = result[1];

      response.status(200).send({ reviews });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviewsById = (request, response, next) => {
  const { review_id } = request.params;

  selectReviewsById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByReviewId = (request, response, next) => {
  const { review_id } = request.params;

  const reviews = selectReviewsById(review_id);
  const comments = selectComments(review_id);

  return Promise.all([reviews, comments])
    .then((result) => {
      const comments = result[1];
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postComment = (request, response, next) => {
  const { review_id } = request.params;

  const reviewsPromise = selectReviewsById(review_id);
  const commentsPromise = insertComments(review_id, request.body);

  Promise.all([reviewsPromise, commentsPromise])
    .then((result) => {
      const newComment = result[1];
      response.status(201).send({ newComment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchReview = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;

  const selectReviewsPromise = selectReviewsById(review_id);
  const updateReviewPromise = updateReview(review_id, inc_votes);

  Promise.all([selectReviewsPromise, updateReviewPromise])
    .then((result) => {
      const review = result[1];
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((result) => {
      const users = { users: result };
      response.status(200).send(users);
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;

  const selectCommentsPromise = selectComments(null, comment_id);
  const removeCommentPromise = removeComment(comment_id);

  Promise.all([selectCommentsPromise, removeCommentPromise])
    .then((result) => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

exports.invalidPath = (request, response, next) => {
  const paths = [
    "GET /api",
    "GET /api/categories",
    "GET /api/reviews",
    "GET /api/reviews/:review_id",
    "GET /api/reviews/:review_id/comments",
    "POST /api/reviews/:review_id/comments",
    "GET /api/users",
    "PATCH /api/reviews/:review_id",
    "DELETE /api/comments/:comment_id",
  ];

  const randomIndex = Math.floor(Math.random() * paths.length);
  const randomPath = paths[randomIndex];

  response
    .status(404)
    .send({
      msg: `That's not a valid path, try this instead --> ${randomPath}`,
    });
};
