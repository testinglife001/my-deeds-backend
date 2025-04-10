// const mongoose = require('mongoose');
import mongoose from "mongoose";


export const connectDB = async()=>{
    try {
         const conn = await mongoose.connect(process.env.MONGO_URI,
        //const conn = await mongoose.connect(
        //    "mongodb+srv://testinglife001:MkDV77J0x1fniWB4@mysimpleapp.ndaxdri.mongodb.net/?retryWrites=true&w=majority&appName=mysimpleapp",
            {
            useNewUrlParser:true,
            useCreateIndex: true
            }
        )
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error);
        
    }
}

// module.exports = connectDB;
// 