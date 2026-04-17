import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(process.cwd(), "uploads");

// 稽核點：確保資料夾存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^\w\u4e00-\u9fa5]/g, "-");
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadRequestAttachments = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      // 修正：在 Multer 的 Filter 中正確拋出錯誤的方式
      return cb(new Error("不支援的檔案格式") as any, false);
    }
    cb(null, true);
  },
});
