import express from "express";
import { home_article_get, home_tag_category_get, old_react_article } from "../../controllers/home/homeController.js";
import { getAllImages, getImageDetailById, uploadImages } from "../../controllers/home/ImageController.js";
import { uploadMultiple } from "../../middleware/ImageUploader.js";
import { createPost, getAllPost } from "../../controllers/home/PostController.js";

const router = express.Router();




router.get('/home-article-get', home_article_get );
router.get('/home/get-tag-category', home_tag_category_get );
router.get('/article/recent-old-get', old_react_article );
router.get('/category-article-get',  );
router.get('/tag-article-get',  );


router.get('/images', getAllImages );
router.get('/images/:id', getImageDetailById );
router.post('/images/upload-images', uploadMultiple, uploadImages );



router.post('/posts/create-post', createPost );
router.get('/posts/get-all-post', getAllPost );



export default router;