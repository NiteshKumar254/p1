import express from 'express';
import { createPostController, deletePostController, getAllPostsController, getPostController, getRelatedPostController, searchProductController, updatePostController } from '../controller/Post.js';


const routes = express.Router();

routes.post('/create-post', createPostController );
routes.get('/get-post/:slug', getPostController ) ;
routes.get("/get-all-posts", getAllPostsController );
routes.put("/update-post/:id" , updatePostController );
routes.delete("/delete-post/:id" , deletePostController );
routes.get('/related-post/:pid/:cid', getRelatedPostController );
routes.get('/search/:keyword', searchProductController );



export default routes;
