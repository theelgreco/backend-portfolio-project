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
      `SELECT * FROM reviews 
    ORDER BY created_at DESC`
    )
    .then((result) => {
      const reviews = result.rows;
      return reviews;
    })
    .then((result) => {
      const comments = db.query(`SELECT review_id FROM comments`);
      return Promise.all([result, comments]);
    })
    .then((result) => {
      const reviews = result[0];
      const comments = result[1].rows;
      reviews.forEach((review) => {
        return (review.comment_count = 0);
      });
      comments.forEach((comment) => {
        reviews.forEach((review) => {
          if (review.review_id === comment.review_id) {
            review.comment_count++;
          }
        });
      });
      return reviews;
    });
};
