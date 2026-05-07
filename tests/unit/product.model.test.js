const { validateProductInput } = require("../../src/models/product");

test("valid product returns no errors", () => {
  expect(validateProductInput({ name: "Keyboard", price: 49.99 })).toEqual([]);
});

test("invalid product returns errors", () => {
  const errors = validateProductInput({ name: "K", price: -1 });
  expect(errors.length).toBeGreaterThan(0);
});
