import express from 'express';
import authRoutes from "./routes/auth"
import mangoose from "mongoose";
import dotenv from 'dotenv'



dotenv.config();



mangoose
  .connect(
    "mongodb+srv://varmakmk09:Mani%404689@maniapp.zkqoozw.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("db connected ");
    const app = express();

    app.listen(8080, () => {
      console.log("now listing to port 8080");
    });

    // app.get("/",(req,res)=> res.send('Hello World'));
    app.use(express.json());
    app.use("/auth", authRoutes);
  })
  .catch((error) => {
    throw new Error(error);
  });