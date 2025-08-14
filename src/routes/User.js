import express from 'express';
import { registerController } from '../controller/User.js';
import { loginController } from '../controller/User.js';

const app = express.Router();

app.post('/register', registerController );
app.post('/login', loginController ); // Assuming you have a loginController

export default app;