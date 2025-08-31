import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

let minioClient: Client | null = null;

function connect(
  endpoint: string,
  accessKey: string,
  secretKey: string,
): Client {
  minioClient = new Client({
    endPoint: endpoint,
    port: 9000,
    useSSL: false,
    accessKey,
    secretKey,
  });
  console.info('MinIO connected successfully');
  return minioClient;
}

function init(): Client {
  if (!minioClient) {
    minioClient = connect(
      process.env.ENDPOINT as string,
      process.env.ACCESS_KEY as string,
      process.env.SECRET_KEY as string,
    );
  }
  return minioClient;
}

function getClient(): Client {
  if (!minioClient) {
    const error = new Error('Connection not initialized.');
    console.error(error);
    throw error;
  }

  return minioClient;
}

export { init, getClient };
