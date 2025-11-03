import type { Request, Response } from 'express';
import uploadService from '../services/upload';
import { code } from '../utils/constants';
import { AppError } from '../utils/AppError';

const uploadPostImages = async (req: Request, res: Response) => {
  const files = Array.isArray(req.files)
    ? (req.files as Express.Multer.File[])
    : [];
  if (!files.length) {
    throw new AppError('No files uploaded', code.BAD_REQUEST);
  }
  const hasInvalidFile = files.some(
    file => !file.mimetype.startsWith('image/'),
  );
  if (hasInvalidFile) {
    throw new AppError('Only image files are allowed', code.BAD_REQUEST);
  }
  const fileUrls = await uploadService.uploadPostImages(files);
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Images uploaded successfully',
    data: { fileUrls },
  });
};

export { uploadPostImages };
