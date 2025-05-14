import express from "express";
import { getUserDetailsById } from "../controllers/userDetails.controller";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserDetailsById(req.params.id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});
export default router;
