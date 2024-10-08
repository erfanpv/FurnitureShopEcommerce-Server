import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./src/config/db.js";
import userRouter from "./src/routes/userRouter.js";
import adminRouter from "./src/routes/adminRouter.js";

const app = express();
dotenv.config();

connectDb();

app.use(cors());  
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "This route is not available." });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server Listening on port http://localhost:${PORT}`)
);
