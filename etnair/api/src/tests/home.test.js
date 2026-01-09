const request = require("supertest");
const app = require("../app");

describe("GET /api/", () => {
  it("retourne 200 et un message", async () => {
    const res = await request(app).get("/api/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
