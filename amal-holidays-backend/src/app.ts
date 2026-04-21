import express from "express";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import packageRoutes from "./routes/packageRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(express.json());

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/packages", packageRoutes);

app.use("/api/payments", paymentRoutes);

export default app;