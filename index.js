import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDb } from './src/config/db.js';
import authRoutes from './src/routes/User.js'; // Assuming you have auth routes in User.js
import postRoutes from './src/routes/Post.js'; // Assuming you have post routes in Post.js
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

 dotenv.config();

 connectToDb();

 const app = express();

 app.use(express.json());
 app.use(cors());
 app.use(morgan( 'dev' ));
 app.use(fileUpload({useTempFiles:true}));

 //middleware
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));


 const PORT = process.env.PORT || 3000; 

 app.get('/', (req, res) => {
  console.log('Welcome to the  API');
  res.send('Welcome to the API'); 

 });

//Routes
 app.use('/api/auth' , authRoutes );
 app.use("/api/post", postRoutes);




 app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 });
