import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import packageRoutes from "./routes/packageRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import destinationRoutes from "./routes/destinationRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import imageRoutes from "./routes/imageRoutes";
import fs from "fs";
import path from "path";

const app = express();

/* Ensure uploads directory exists */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/packages", packageRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/destinations", destinationRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/images", imageRoutes);

export default app;
