const express = require("express");
const request = require("supertest");

jest.mock("../../src/services/productService", () => ({
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const productService = require("../../src/services/productService");
const productsRouter = require("../../src/routes/products");

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/products", productsRouter);
  return app;
}

beforeEach(() => {
  jest.resetAllMocks();
});

test("POST /products returns 500 for unexpected errors", async () => {
  productService.create.mockImplementation(() => {
    throw new Error("boom");
  });

  await request(makeApp())
    .post("/products")
    .send({ name: "Mouse", price: 19.99 })
    .expect(500, { error: "Something went wrong!" });
});

test("PUT /products/:id returns 500 for unexpected errors", async () => {
  productService.update.mockImplementation(() => {
    throw new Error("boom");
  });

  await request(makeApp())
    .put("/products/1")
    .send({ name: "Mouse Pro", price: 29.99 })
    .expect(500, { error: "Something went wrong!" });
});

