import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/AppError.js';

const getStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = `uploads/${folderName}/`;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Only images are allowed (.jpeg, .jpg, .png, .webp)', 400), false);
  }
};

const attachmentFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype) || file.mimetype === 'application/pdf' || file.mimetype.includes('msword') || file.mimetype.includes('officedocument');

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Format not supported. Only documents (.pdf, .doc, .docx, .xls, .xlsx, .txt) and images are allowed.', 400), false);
  }
};

export const uploadProfileImage = multer({
  storage: getStorage('profiles'),
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});

export const uploadVisitorPhoto = multer({
  storage: getStorage('visitors'),
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});

export const uploadComplaintImages = multer({
  storage: getStorage('complaints'),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter,
});

export const uploadNoticeAttachment = multer({
  storage: getStorage('notices'),
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: attachmentFilter,
});

export default uploadProfileImage;
