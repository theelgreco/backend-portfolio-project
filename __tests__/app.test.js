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
  test("accepts a request parameter and returns correct review object when given valid ID", () => {
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
  test("returns 404 status with custom message when invalid id given", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no user with that id");
      });
  });
  test("returns 400 when given anything other than a number", () => {
    return request(app)
      .get("/api/reviews/pizza")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("ID must be a number!");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test.only("201: responds with the posted comment object on successful post", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "dav3rid", body: "this game sucks" })
      .expect(201)
      .then((response) => {
        const { newComment } = response.body;
        expect(newComment.length).toBe(1);
        expect(newComment[0]).toMatchObject({
          body: "this game sucks",
          votes: 0,
          author: "dav3rid",
          review_id: 1,
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("400: responds with error when request format is incorrect", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ wrongProperty1: "wrongValue1", wrongProperty2: "wrongValue2" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("incorrect data sent");
      });
  });
  test("400: responds with error when given invalid id", () => {
    return request(app)
      .post("/api/reviews/wrongIdFormat/comments")
      .send({ username: "stel", body: "this game sucks" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("ID must be a number!");
      });
  });
  test("404: responds with error when id does not exist", () => {
    return request(app)
      .post("/api/reviews/932/comments")
      .send({ username: "stel", body: "this game sucks" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("There is no user with that id");
      });
  });
});
