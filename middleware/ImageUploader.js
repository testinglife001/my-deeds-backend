import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary'; 
import { v2 as cloudinary } from 'cloudinary';



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mysimpleapp',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.originalname.split('.')[0] + ""
    }
})

const cloudinaryImageFileUploader = multer({ storage: storage });
// Middleware to handle multiple file uploads (e.g., max 10 files)
const uploadMultiple = cloudinaryImageFileUploader.array('images', 10);

export  {
    cloudinaryImageFileUploader,
    uploadMultiple
}

