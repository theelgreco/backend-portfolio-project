const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("bad paths", () => {
  test("404: responds with path not found", () => {
    return request(app)
      .get("/badpath")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("path not found!");
      });
  });
});

describe("GET /api/categories", () => {
  test("200: responds with an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const { categories } = response.body;
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: responds with an array of review objects with the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const { reviews } = response.body;

        expect(reviews.length).toBe(13);

        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: returned data is sorted by date descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const { reviews } = response.body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: accepts a request parameter and returns correct review object when given valid ID", () => {
    return request(app)
      .get("/api/reviews/5")
      .expect(200)
      .then((response) => {
        const { review } = response.body;
        expect(review).toMatchObject({
          review_id: 5,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("404: returns 404 status with custom message when invalid id given", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no review with that id");
      });
  });
  test("400: returns 400 when given anything other than a number", () => {
    return request(app)
      .get("/api/reviews/pizza")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("ID must be a number!");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns array of comments associated with valid specified review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments.length).toBe(3);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
  test("200: returns empty array when given a review_id that exists but has no associated comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
        expect(response.body).toHaveProperty("comments");
      });
  });
  test("404: returns an error when given review_id that does not exist", () => {
    return request(app)
      .get("/api/reviews/150/comments")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no review with that id");
      });
  });
  test("400: returns 400 when review_id is anything other than a number", () => {
    return request(app)
      .get("/api/reviews/doughnuts/comments")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("ID must be a number!");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: responds with the posted comment object with the correct properties", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "dav3rid", body: "this game sucks" })
      .expect(201)
      .then((response) => {
        const { newComment } = response.body;
        expect(newComment).toMatchObject({
          body: "this game sucks",
          votes: 0,
          author: "dav3rid",
          review_id: 1,
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("400: responds with error when the request body is not in the correct format", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ wrongProperty1: "wrongValue1", wrongProperty2: "wrongValue2" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("incorrect data sent!");
      });
  });
  test("400: responds with error when no data is sent", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({})
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("no data was sent!");
      });
  });
  test("400: responds with error when review_id is anything other than a number", () => {
    return request(app)
      .post("/api/reviews/wrongIdFormat/comments")
      .send({ username: "stel", body: "this game sucks" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("ID must be a number!");
      });
  });
  test("404: responds with error when given review_id that does not exist", () => {
    return request(app)
      .post("/api/reviews/932/comments")
      .send({ username: "stel", body: "this game sucks" })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no review with that id");
      });
  });
});

describe("GET api/users", () => {
  test("200: responds with an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { users } = response.body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: responds with updated review object with the correctly incremented votes property", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        const { review } = response.body;
        expect(review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: 2,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("200: responds with updated review object with the correctly decremented votes property", () => {
    return request(app)
      .patch("/api/reviews/5")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((response) => {
        const { review } = response.body;
        expect(review).toMatchObject({
          review_id: 5,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: 0,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("200: responds with original review with the votes unaffected, when sent an empty request", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({})
      .expect(200)
      .then((response) => {
        const { review } = response.body;
        expect(review).toMatchObject({
          review_id: 3,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: 5,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("400: responds with error when the request body value is an incorrect data type", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "pizza" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("invalid data type sent");
      });
  });
  test("404: responds with error when given review_id that does not exist", () => {
    return request(app)
      .patch("/api/reviews/4004")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no review with that id");
      });
  });
  test("400: responds with error when review_id is anything other than a number", () => {
    return request(app)
      .patch("/api/reviews/not_an_id")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("ID must be a number!");
      });
  });
});

xdescribe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with success message when comment is succesfully deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("The comment has been deleted");
      });
  });
  test("404: responds with error when invalid comment id type is given", () => {
    return request(app)
      .delete("/api/comments/not-a-valid-comment")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Comment ID must be a number!");
      });
  });
  test("400: responds with error when non-existent comment id is given", () => {
    return request(app)
      .delete("/api/comments/1005")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no comment with that ID");
      });
  });
});
