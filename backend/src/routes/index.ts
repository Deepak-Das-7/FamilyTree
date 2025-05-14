import express from "express";
import userRoutes from "./userRoutes";
import userDetailsRoutes from "./userDetailsRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/usersDetails", userDetailsRoutes);

router.get("/health", (_req, res) => {
  res.send("API is healthy");
});

export default router;
