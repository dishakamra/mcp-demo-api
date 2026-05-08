const { validateProductInput } = require("../../src/models/product");

test("valid product returns no errors", () => {
  expect(validateProductInput({ name: "Keyboard", price: 49.99 })).toEqual([]);
});

test("invalid product returns errors", () => {
  const errors = validateProductInput({ name: "K", price: -1 });
  expect(errors.length).toBeGreaterThan(0);
});

test("non-object body returns a clear error", () => {
  expect(validateProductInput(null)).toEqual(["Body must be a JSON object"]);
  expect(validateProductInput("not-an-object")).toEqual(["Body must be a JSON object"]);
});

test("name is trimmed before validation", () => {
  const errors = validateProductInput({ name: " A ", price: 10 });
  expect(errors).toContain("name must be a string with at least 2 characters");
});
