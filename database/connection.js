import mongoose from "mongoose";

export default async function connectDB(){
  try {
    mongoose.connect(process.env.MONGO_DB,{
        
    });
    console.log("Database connected successfully ");
  } catch (error) {
    console.log(error);
  }
};
