const { validateProductInput } = require("../models/product");

const db = new Map(); // in-memory store
let nextId = 1;

function list() {
  return Array.from(db.values());
}

function get(id) {
  return db.get(id);
}

function create(product) {
  const errors = validateProductInput(product);
  if (errors.length) {
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = errors;
    throw err;
  }
  const created = { id: String(nextId++), ...product };
  db.set(created.id, created);
  return created;
}

function update(id, patch) {
  const existing = db.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...patch };
  const errors = validateProductInput(updated);
  if (errors.length) {
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = errors;
    throw err;
  }
  db.set(id, updated);
  return updated;
}

function remove(id) {
  return db.delete(id);
}

module.exports = { list, get, create, update, remove };
