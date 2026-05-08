function loadFreshService() {
  jest.resetModules();
  return require("../../src/services/productService");
}

test("create persists and returns a string id", () => {
  const productService = loadFreshService();

  const created = productService.create({ name: "Mouse", price: 19.99 });
  expect(created).toEqual({ id: expect.any(String), name: "Mouse", price: 19.99 });
  expect(productService.get(created.id)).toEqual(created);
});

test("create throws a 400 with details on validation failure", () => {
  const productService = loadFreshService();

  try {
    productService.create({ name: "A", price: 0 });
    throw new Error("Expected create to throw");
  } catch (err) {
    expect(err.status).toBe(400);
    expect(err.message).toBe("Validation failed");
    expect(err.details).toEqual(
      expect.arrayContaining([
        "name must be a string with at least 2 characters",
        "price must be a number greater than 0",
      ]),
    );
  }
});

test("update returns null for missing id", () => {
  const productService = loadFreshService();
  expect(productService.update("does-not-exist", { name: "Updated", price: 10 })).toBeNull();
});

test("update throws a 400 with details when patch makes entity invalid", () => {
  const productService = loadFreshService();

  const created = productService.create({ name: "Keyboard", price: 49.99 });

  try {
    productService.update(created.id, { price: -1 });
    throw new Error("Expected update to throw");
  } catch (err) {
    expect(err.status).toBe(400);
    expect(err.details).toEqual(expect.arrayContaining(["price must be a number greater than 0"]));
  }
});

test("remove returns false when id does not exist", () => {
  const productService = loadFreshService();
  expect(productService.remove("missing")).toBe(false);
});

