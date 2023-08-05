const request = require("supertest");
const app = require("../../app");

describe("POST /api/cats/upload", () => {
  it("should upload a cat picture", async () => {
    const response = await request(app)
      .post("/api/cats/upload")
      .auth("cat", "meow")
      .attach("catImage", "src/tests/test-cat.jpg");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty(
      "message",
      "Cat picture uploaded successfully!",
    );
  });
});

describe("GET /api/cats/fetch", () => {
  it("should fetch all cat pictures", async () => {
    const response = await request(app)
      .get("/api/cats/fetch")
      .auth("cat", "meow");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("catPictures");
    expect(Array.isArray(response.body.catPictures)).toBe(true);
  });
});

describe("GET /api/cats/fetch/:id", () => {
  it("should fetch a particular cat picture", async () => {
    const uploadResponse = await request(app)
      .post("/api/cats/upload")
      .auth("cat", "meow")
      .attach("catImage", "src/tests/test-cat.jpg");

    const catId = uploadResponse.body.id;

    const response = await request(app)
      .get(`/api/cats/fetch/${catId}`)
      .auth("cat", "meow");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("image/jpeg");
  });

  it("should return 404 if cat picture not found", async () => {
    const response = await request(app)
      .get("/api/cats/nonexistentid")
      .auth("cat", "meow");
    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/cats/delete/:id", () => {
  it("should delete a cat picture", async () => {
    const uploadResponse = await request(app)
      .post("/api/cats/upload")
      .auth("cat", "meow")
      .attach("catImage", "src/tests/test-cat.jpg");

    const catId = uploadResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/api/cats/delete/${catId}`)
      .auth("cat", "meow");
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty(
      "message",
      "Cat picture deleted successfully!",
    );
  });

  it("should return 404 if cat picture not found", async () => {
    const response = await request(app)
      .delete("/api/cats/delete/nonexistentid")
      .auth("cat", "meow");

    expect(response.status).toBe(404);
  });
});
