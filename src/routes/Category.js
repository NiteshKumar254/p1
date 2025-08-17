import express from "express";
import { createCategoryController, deleteCategory, getAllCategory, singleCategoryController, updateCategoryController } from "../controller/Category.js";
import {isAdmin, requireSignIn} from '../middlewares/Auth.js'

const app= express.Router();

app.post("/create-category" ,isAdmin, requireSignIn,  createCategoryController);
app.get('/get-category',isAdmin, requireSignIn, getAllCategory );
app.put('/update-category/:id', isAdmin, requireSignIn, updateCategoryController )
app.delete('/delete-category/:id',isAdmin, requireSignIn,deleteCategory )
app.get('/single-category/:slug',singleCategoryController )

export default app;
