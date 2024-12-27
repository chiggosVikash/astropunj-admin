'use server';

import { v2 as cloudinary } from 'cloudinary';


export const saveImage = async (image: File): Promise<string> => {
  const config = cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
  });

  console.log("Config is ",config)


  const arrayBuffer = await image.arrayBuffer();
  const imageBuffer = new Uint8Array(arrayBuffer);

  const secureUrl:string = await new Promise((resolve, reject) => {
    return cloudinary.uploader.upload_stream({}, (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (result) {
          resolve(result.secure_url);
          return result.secure_url // Return the secure URL
        } else {
          reject(new Error('Upload failed, no result returned.'));
        }
      }
    }).end(imageBuffer);
  });
  console.log("Secure URL is ",secureUrl)
  return secureUrl
};