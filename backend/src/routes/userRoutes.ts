import express from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getFathers,
  getMothers,
  getSpouces,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    res.status(200).json(deleted);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Use req.query instead of req.body
router.get("/list/fatherList", async (req, res) => {
  try {
    const user = await getFathers(req.query.date as string);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/list/motherList", async (req, res) => {
  try {
    const user = await getMothers(req.query.date as string);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/list/spouceList", async (req, res) => {
  try {
    const user = await getSpouces(
      req.query.date as string,
      req.query.gender as string
    );
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
