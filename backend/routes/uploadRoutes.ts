import path from "path";
import express from "express";
import { Request, Response } from 'express';
import multer from "multer";

const router = express.Router();

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: function (req, file: any, cb) {
    cb(null, path.join(__dirname, '../uploads/image_room')); // Đường dẫn để lưu ảnh
  },
  filename: function (req, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Kiểm tra xem file có phải là ảnh (jpg, jpeg, png) hay không
function checkFileType(file: any, cb: any) {
  const fileTypes = /jpg|jpeg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Chỉ chấp nhận ảnh", false);
  }
}

// Khởi tạo multer với các cài đặt storage và file filter
const upload = multer({
  storage,
  fileFilter: function (req, file: any, cb: any) {
    checkFileType(file, cb);
  },
});

// Route để xử lý tải ảnh lên
router.post("/", upload.array("image", 10), (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  res.status(200).json(req.files);
});

export default router;
