const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("GET /api responds with 200 server ok message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("server ok");
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
