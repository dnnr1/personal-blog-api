import type { Request, Response } from 'express';
import uploadService from '../services/upload';
import { code } from '../utils/constants';
import { AppError } from '../utils/AppError';

const uploadPostImage = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', code.BAD_REQUEST);
  }
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are allowed', code.BAD_REQUEST);
  }
  const fileUrl = await uploadService.uploadPostImage(req.file);
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Image uploaded successfully',
    data: { fileUrl },
  });
};

export { uploadPostImage };
