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
import hotelRoutes from "./routes/hotelRoutes";
import driverRoutes from "./routes/driverRoutes";
import tourGuideRoutes from "./routes/tourGuideRoutes";
import inquiryRoutes from "./routes/inquiryRoutes";
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

app.use((req, res, next) => {
  console.log(`\n[REQUEST] ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.params).length) {
    console.log("  params:", JSON.stringify(req.params, null, 2));
  }
  if (Object.keys(req.query).length) {
    console.log("  query:", JSON.stringify(req.query, null, 2));
  }
  if (req.body && Object.keys(req.body).length) {
    console.log("  body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/packages", packageRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/destinations", destinationRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/images", imageRoutes);

app.use("/api/hotels", hotelRoutes);

app.use("/api/drivers", driverRoutes);

app.use("/api/tour-guides", tourGuideRoutes);

app.use("/api/inquiries", inquiryRoutes);

export default app;
