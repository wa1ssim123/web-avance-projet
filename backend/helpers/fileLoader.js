import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("./public/images");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const safeName = String(req.body.nom || req.body.titre || "image")
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}-${safeName}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const accepted = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (accepted.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format image non supporté"));
};

export default multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});
