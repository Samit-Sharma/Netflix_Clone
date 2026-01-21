import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

dotenv.config(); // FIRST load env

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS (important for Vercel frontend)
app.use(
  cors({
    origin: [
      "https://netflix-clone-gules-rho.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

// DB
databaseConnection();

// routes
app.use("/api/v1/user", userRoute);
app.get("/", (req, res) => {
  res.send("API is running...");
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
