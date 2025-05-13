import express from "express";
import userRoutes from "./userRoutes";

const router = express.Router();

router.use("/users", userRoutes);

router.get("/health", (_req, res) => {
  res.send("API is healthy");
});

export default router;
