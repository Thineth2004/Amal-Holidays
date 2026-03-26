import express from "express";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";

const app = express();

app.use(express.json());

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

export default app;