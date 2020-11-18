import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const storage = (params = {}): CloudinaryStorage => {
  return new CloudinaryStorage({
    cloudinary,
    params,
  })
};

export const imageFileFilter = (req, file, callback): void => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  
  callback(null, true);
};

export const maxSize = 5 * 1000 * 1000;
