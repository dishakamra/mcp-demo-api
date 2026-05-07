function validateProductInput(input) {
  const errors = [];
  if (!input || typeof input !== "object") {
    return ["Body must be a JSON object"];
  }
  if (!input.name || typeof input.name !== "string" || input.name.trim().length < 2) {
    errors.push("name must be a string with at least 2 characters");
  }
  if (typeof input.price !== "number" || input.price <= 0) {
    errors.push("price must be a number greater than 0");
  }
  return errors;
}

module.exports = { validateProductInput };
