import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { connectDB } from "./database/connection.js";

import authRoutes from "./routes/auth.route.js";
import dashboardRoutes from "./routes/dashboard/dashboardRoute.js";
import homeRoutes from "./routes/home/homeRoute.js";


if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: "./config/.env",
    });
}

const app = express();
 const PORT = process.env.PORT || 5000;

 app.get("/",(req,res) => {
    res.send("Hello Ola, World!");
 });

const corsConfig = {
    // origin: process.env.Client_URL,
    origin: process.env.MODE === 'production' ?
            [process.env.client_vendor_production_url] :
            [process.env.client_vendor_local_url],
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({extended: true, limit: "50mb" }));


// app.use(express.json()); // allows us to parse incoming requests:req.body

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", homeRoutes );

connectDB();

// app.listen(PORT, () => {
//    connectDB();
//	console.log("Server is running on port: ", PORT);
// });

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
  