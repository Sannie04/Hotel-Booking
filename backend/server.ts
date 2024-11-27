import express from 'express';
import { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import { errorHandler, notFound } from './middlewares/errorMiddleware';

// Các Routes
import roomRoutes from './routes/roomRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app: Application = express();

dotenv.config();

// Kết nối đến database
connectDB();

// Phục vụ các tệp tĩnh từ thư mục "uploads"


app.use(cors());
app.use(express.json());

// Route mặc định
app.get("/api", (req: Request, res: Response) => {
    res.status(201).json({ message: "Welcome to Hotel Booking App" });
});

// Routes cho phòng, người dùng, và đặt phòng
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Route upload ảnh
app.use("/api/uploads", uploadRoutes);

// Route cấu hình PayPal
app.get("/api/config/paypal", (req, res) => {
  res.status(201).send(process.env.PAYPAL_CLIENT_ID);
});

// Middleware xử lý lỗi
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => console.log(`Server is running on PORT ${PORT}`));
