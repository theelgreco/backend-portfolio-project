const {
  selectCategories,
  selectReviews,
  selectReviewsById,
  insertComments,
  selectComments,
} = require("../models/models.js");

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
  selectReviews()
    .then((reviews) => {
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
