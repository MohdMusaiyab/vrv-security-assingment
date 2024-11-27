import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth/authRoutes";

const app = express();
dotenv.config();

app.use(express.json())
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
