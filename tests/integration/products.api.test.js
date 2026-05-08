const request = require("supertest");

function loadFreshApp() {
  jest.resetModules();
  return require("../../src/server");
}

let app;
beforeEach(() => {
  app = loadFreshApp();
});

test("health check returns ok", async () => {
  await request(app).get("/health").expect(200, { status: "ok" });
});

test("list returns empty array when there are no products", async () => {
  const list = await request(app).get("/products").expect(200);
  expect(list.body).toEqual([]);
});

test("CRUD flow", async () => {
  // Create
  const created = await request(app)
    .post("/products")
    .send({ name: "Mouse", price: 19.99 })
    .expect(201);

  const id = created.body.id;

  // List
  const list = await request(app).get("/products").expect(200);
  expect(list.body.length).toBeGreaterThan(0);

  // Get
  await request(app).get(`/products/${id}`).expect(200);

  // Update
  await request(app).put(`/products/${id}`).send({ name: "Mouse Pro", price: 29.99 }).expect(200);

  // Delete
  await request(app).delete(`/products/${id}`).expect(204);
});

test("validation returns 400", async () => {
  const res = await request(app).post("/products").send({ name: "A", price: 0 }).expect(400);
  expect(res.body).toEqual({
    error: "Validation failed",
    details: expect.arrayContaining([
      "name must be a string with at least 2 characters",
      "price must be a number greater than 0",
    ]),
  });
});

test("update validation returns 400 with details", async () => {
  const created = await request(app).post("/products").send({ name: "Desk", price: 100 }).expect(201);

  const res = await request(app).put(`/products/${created.body.id}`).send({ price: -1 }).expect(400);
  expect(res.body).toEqual({
    error: "Validation failed",
    details: expect.arrayContaining(["price must be a number greater than 0"]),
  });
});

test("returns 404 when product does not exist", async () => {
  await request(app).get("/products/does-not-exist").expect(404, { error: "Not found" });
  await request(app).put("/products/does-not-exist").send({ name: "X", price: 1 }).expect(404, { error: "Not found" });
  await request(app).delete("/products/does-not-exist").expect(404, { error: "Not found" });
});
