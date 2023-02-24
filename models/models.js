const db = require("../db/connection.js");
const fsPromises = require("fs").promises;

exports.readEndpoints = () => {
  return fsPromises
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((result) => {
      return result;
    });
};

exports.selectCategories = (category) => {
  let queryString = `SELECT * FROM categories`;

  return db.query(queryString).then((result) => {
    const categories = result.rows;

    const validCategories = [];
    categories.forEach((category) => validCategories.push(category.slug));

    if (category && !validCategories.includes(category)) {
      return Promise.reject("invalid category");
    }

    return categories;
  });
};

exports.selectReviews = (category, sort_by, order) => {
  const validSortByOptions = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];
  const validOrderOptions = ["asc", "desc"];
  let queryParams = [];

  let queryString = `
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    `;

  if (category) {
    queryParams.push(category);
    queryString += `WHERE category = $1 GROUP BY reviews.review_id`;
  } else {
    queryString += ` GROUP BY reviews.review_id`;
  }

  if (sort_by && !validSortByOptions.includes(sort_by)) {
    return Promise.reject("invalid sort by option");
  } else if (sort_by) {
    queryString += ` ORDER BY ${sort_by}`;
  } else {
    queryString += ` ORDER BY created_at`;
  }

  if (order && !validOrderOptions.includes(order)) {
    return Promise.reject("invalid order by option");
  } else if (order) {
    queryString += ` ${order}`;
  } else {
    queryString += ` DESC`;
  }

  return db.query(queryString, queryParams).then((result) => {
    const reviews = result.rows;
    //converted comment count to number as it was being returned as a string
    reviews.map((review) => {
      return (review.comment_count = Number(review.comment_count));
    });

    return reviews;
  });
};

exports.selectReviewsById = (id) => {
  let queryString = `
  SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id
  `;
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
      review.comment_count = Number(review.comment_count);
      return review;
    }
  });
};

exports.selectComments = (review_id, comment_id) => {
  let queryParams = [];

  if (review_id) {
    queryParams.push(review_id);
    return db
      .query(
        `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC
    `,
        queryParams
      )
      .then((result) => {
        return result.rows;
      });
  }

  if (comment_id) {
    queryParams.push(comment_id);
    return db
      .query(
        `
      SELECT * FROM comments
      WHERE comment_id = $1
    `,
        queryParams
      )
      .then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject("comment id does not exist");
        }
      });
  }
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

exports.removeComment = (comment_id) => {
  let queryParams = [comment_id];
  let queryString = "DELETE FROM comments WHERE comment_id = $1";
  return db.query(queryString, queryParams).then((result) => {
    return result.rows;
  });
};
