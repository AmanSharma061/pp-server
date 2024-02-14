import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

 const uploadCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const response = cloudinary.uploader.upload(filePath, {
      resource_type: "auto"
    });
    ///file Uploaded Successfully

    console.log("file Uploded successfully", (await response).url);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath); //remove the locallysaveed file
    return null;
  }
};
export default uploadCloudinary