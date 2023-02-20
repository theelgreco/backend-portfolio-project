const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("bad paths", () => {
  test("status 404 responds with path not found", () => {
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
  test("responds with an array of objects with the correct properties", () => {
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

describe("GET /api/reviews/:review_id", () => {
  test("accepts a request parameter and returns correct review when given valid ID", () => {});
  test("returns 400 status code when invalid id given", () => {});
});
