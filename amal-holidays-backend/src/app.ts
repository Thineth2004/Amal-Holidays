import express from "express";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import packageRoutes from "./routes/packageRoutes";

const app = express();

app.use(express.json());

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/packages", packageRoutes);

export default app;