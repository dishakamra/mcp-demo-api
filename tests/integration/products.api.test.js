const request = require("supertest");
const app = require("../../src/server");

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
  await request(app).post("/products").send({ name: "A", price: 0 }).expect(400);
});
