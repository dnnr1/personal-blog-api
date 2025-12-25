import { getClient } from '../storage/minio';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';

const uploadPostImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    const minioClient = getClient();
    const bucketName = process.env.BUCKET_NAME as string;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    const publicBase = (process.env.MINIO_PUBLIC_URL || '').replace(/\/+$/, '');
    const fallbackBase = `http://${process.env.ENDPOINT || 'localhost'}:9000`;
    const baseUrl = publicBase || fallbackBase;
    return `${baseUrl}/${bucketName}/${fileName}`;
  } catch (error) {
    console.log(error);
    throw new AppError('Upload failed', code.INTERNAL_SERVER_ERROR);
  }
};
const uploadPostImages = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  const uploads = files.map(file => uploadPostImage(file));
  return Promise.all(uploads);
};
const uploadService = {
  uploadPostImage,
  uploadPostImages,
};

export default uploadService;
