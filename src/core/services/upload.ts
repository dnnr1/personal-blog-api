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
    return await minioClient.presignedGetObject(
      bucketName,
      fileName,
      24 * 60 * 60 * 7,
    );
  } catch (error) {
    throw new AppError('Upload failed', code.INTERNAL_SERVER_ERROR);
  }
};
const uploadService = {
  uploadPostImage,
};

export default uploadService;
