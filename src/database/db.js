import mongoose from "mongoose";

const Connection = async (mongourl) => {
  const URL = mongourl;
 
  mongoose.set("strictQuery", true);

  
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      
    });
    console.log("Database connected successfully");
    return "success";
  } catch (error) {
    console.log("Error while connecting with the database", error);
    return error;
  }
};

export default Connection;
