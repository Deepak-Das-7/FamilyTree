import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import routes from "./routes";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", routes);

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Startup error", err);
    process.exit(1);
  });
