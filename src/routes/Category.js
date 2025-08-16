import express from "express";
import { createCategoryController, getAllCategory } from "../controller/Category.js";


const app= express.Router();

app.post("/create-category" , createCategoryController);
app.get('/get-category', getAllCategory );


export default app;
