import express from "express";
import { createCategoryController, deleteCategory, getAllCategory, singleCategoryController, updateCategoryController } from "../controller/Category.js";
import {isAdmin, requireSignIn} from '../middlewares/Auth.js'

const app= express.Router();

app.post("/create-category" , createCategoryController);
app.get('/get-category', getAllCategory );
app.put('/update-category/:id',  updateCategoryController )
app.delete('/delete-category/:id',deleteCategory )
app.get('/single-category/:slug',singleCategoryController )

export default app;
