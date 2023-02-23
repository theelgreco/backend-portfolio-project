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

exports.selectComments = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = ${review_id}
    ORDER BY created_at DESC
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComments = (id, newComment) => {
  const { username, body } = newComment;

  if (Object.keys(newComment).length === 0) {
    return Promise.reject("No data has been sent");
  }

  let valuesToInsert = [body, username, id];
  let queryString = `
          INSERT INTO comments
          (body, author, review_id)
          VALUES ($1, $2, $3)
          RETURNING *
          `;

  return db.query(queryString, valuesToInsert).then((result) => {
    return result.rows[0];
  });
};

exports.selectUsers = () => {
  return db
    .query(
      `
        SELECT * FROM users
        `
    )
    .then((result) => {
      const users = result.rows;
      return result.rows;
    });
};

exports.updateReview = (id, voteAmount) => {
  let queryParams = [];
  let queryString = `
        UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1
        RETURNING *
    `;

  if (id && !voteAmount) {
    queryParams.push(id);
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1`, queryParams)
      .then((result) => {
        return result.rows[0];
      });
  }

  if (id && voteAmount) {
    queryParams.push(id, voteAmount);
  }

  return db.query(queryString, queryParams).then((result) => {
    return result.rows[0];
  });
};

exports.removeComment = (comment_id) => {
  let queryParams = [comment_id];
  let queryString = "DELETE FROM comments WHERE comment_id = $1";
  return db.query(queryString, queryParams).then((result) => {
   
  });
};
