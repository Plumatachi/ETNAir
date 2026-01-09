const request = require("supertest");
const app = require("../app");

describe("POST /api/auth/login", () => {
  it("refuse sans credentials", async () => {
    const res = await request(app).post("api/auth/login").send({});
    expect(res.statusCode).toBe(400);
  });
});

