const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    const categories = result.rows;
    return categories;
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
