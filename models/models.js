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
