import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth/authRoutes";
import studentRoutes from "./routes/student/studentRoutes";
import adminRoutes from "./routes/admin/adminRoutes";
import facultyRoutes from "./routes/faculty/facultyRoutes";

const app = express();
app.use(cookieParser());
dotenv.config();

app.use(express.json());
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

