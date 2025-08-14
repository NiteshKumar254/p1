import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDb } from './src/config/db.js';
import authRoutes from './src/routes/User.js'; // Assuming you have auth routes in User.js

dotenv.config();

connectToDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan( 'dev' ));


const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  console.log('Welcome to the  API');
  res.send('Welcome to the API'); 

});

//Routes
app.use('/api/auth' , authRoutes );




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
