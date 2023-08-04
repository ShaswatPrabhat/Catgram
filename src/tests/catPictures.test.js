// tests/catPictures.test.js

const request = require("supertest");
const app = require("../../app");

// Test case for cat picture upload
describe("POST /api/cats", () => {
  it("should upload a cat picture", async () => {
    const response = await request(app)
      .post("/api/cats")
      .attach("catImage", "./tests/test-cat.jpg");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty(
      "message",
      "Cat picture uploaded successfully!",
    );
  });
});

// Test case for fetching all cat pictures
describe("GET /api/cats", () => {
  it("should fetch all cat pictures", async () => {
    const response = await request(app).get("/api/cats");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("catPictures");
    expect(Array.isArray(response.body.catPictures)).toBe(true);
  });
});

// Test case for fetching a particular cat picture by its ID
describe("GET /api/cats/:id", () => {
  it("should fetch a particular cat picture", async () => {
    // First, upload a cat picture to get its ID
    const uploadResponse = await request(app)
      .post("/api/cats")
      .attach("catImage", "./tests/test-cat.jpg");

    const catId = uploadResponse.body.id;

    // Fetch the cat picture using the obtained ID
    const response = await request(app).get(`/api/cats/${catId}`);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("image/jpeg");
  });

  it("should return 404 if cat picture not found", async () => {
    const response = await request(app).get("/api/cats/nonexistentid");

    expect(response.status).toBe(404);
  });
});

// Test case for deleting a cat picture
describe("DELETE /api/cats/:id", () => {
  it("should delete a cat picture", async () => {
    // First, upload a cat picture to get its ID
    const uploadResponse = await request(app)
      .post("/api/cats")
      .attach("catImage", "./tests/test-cat.jpg");

    const catId = uploadResponse.body.id;

    // Delete the cat picture using the obtained ID
    const deleteResponse = await request(app).delete(`/api/cats/${catId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty(
      "message",
      "Cat picture deleted successfully!",
    );
  });

  it("should return 404 if cat picture not found", async () => {
    const response = await request(app).delete("/api/cats/nonexistentid");

    expect(response.status).toBe(404);
  });
});
