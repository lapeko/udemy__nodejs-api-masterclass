import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
  res.json({ error: null, success: true });
});

router.post("/", (req, res) => {
  res.json({ error: null, success: true });
});

router.delete("/:id", (req, res) => {
  res.json({ error: null, success: true });
});

router.put("/:id", (req, res) => {
  res.json({ error: null, success: true });
});

router.patch("/:id", (req, res) => {
  res.json({ error: null, success: true });
});
