import express from 'express';
import {  registerController } from '../controller/User.js';
import { loginController } from '../controller/User.js';
import {requireSignIn, isAdmin } from '../middlewares/Auth.js'

const app = express.Router();

app.post('/register', registerController );
app.post('/login', loginController ); // Assuming you have a loginController
// router.get('/user', getUserInfo);

//protected User route auth
   app.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
// //protected Admin route auth
   app.get('/is-admin', requireSignIn , isAdmin  , (req, res) => {
    res.status(200).send({ ok: true });
});

export default app;

// import { getUserInfo, loginController, registerController } from "../controller/User.js";
// import { requireSignIn, isAdmin } from "../middlewares/Auth.js";

// const router = express.Router();

// router.post("/register", registerController);
// router.post("/login", loginController);
// 

// 

// export default router;