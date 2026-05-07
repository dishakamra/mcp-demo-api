const express = require("express");
const productService = require("../services/productService");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(productService.list());
});

router.get("/:id", (req, res) => {
  const product = productService.get(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

router.post("/", (req, res) => {
  try {
    const created = productService.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    if (e.status === 400) return res.status(400).json({ error: e.message, details: e.details });
    res.status(500).json({ error: "Something went wrong!" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const updated = productService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    if (e.status === 400) return res.status(400).json({ error: e.message, details: e.details });
    res.status(500).json({ error: "Something went wrong!" });
  }
});

router.delete("/:id", (req, res) => {
  const ok = productService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

module.exports = router;
