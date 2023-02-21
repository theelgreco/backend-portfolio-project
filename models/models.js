const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    const categories = result.rows;
    return categories;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
         FROM reviews
         LEFT JOIN comments
         ON reviews.review_id = comments.review_id
         GROUP BY reviews.review_id
         ORDER BY created_at DESC`
    )
    .then((result) => {
      const reviews = result.rows;
      //converted comment count to number as it was being returned as a string
      reviews.map((review) => {
        return (review.comment_count = Number(review.comment_count));
      });

      return reviews;
    });
};

exports.selectReviewsById = (id) => {
  let queryString = `SELECT * FROM reviews
    WHERE review_id = $1`;
  const queryParams = [];

  if (Number(id)) {
    queryParams.push(id);
  } else {
    return Promise.reject("id is not a number");
  }

  return db.query(queryString, queryParams).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("invalid review_id");
    } else {
      const review = result.rows[0];
      return review;
    }
  });
};
