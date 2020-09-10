import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



export const storage = (folder?: string) =>  {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      ...(folder ? {folder} : {})
    },
  })
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) return callback(new Error('Only image files are allowed!'), false);
  
  callback(null, true);
};

export const maxSize = 5 * 1000 * 1000;
