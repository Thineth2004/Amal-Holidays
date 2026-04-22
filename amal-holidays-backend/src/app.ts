import express from "express";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import packageRoutes from "./routes/packageRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import destinationRoutes from "./routes/destinationRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";

const app = express();

app.use(express.json());

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/packages", packageRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/destinations", destinationRoutes);

app.use("api/assignments", assignmentRoutes);

export default app;