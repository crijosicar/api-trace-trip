import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'assets',
    format: async (req, file): Promise<string> => 'png',
  },
});
