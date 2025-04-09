import express from "express";

const router = express.Router();


import { admin_middleware } from "../../middleware/authMiddleware.js";
import { category_add, category_delete, category_edit, category_get, category_update } from "../../controllers/dashboard/categoryController.js";
import { add_article, delete_article, edit_article, get_article, get_tag_category, update_article } from "../../controllers/dashboard/articleController.js";
import { tag_add, tag_delete, tag_edit, tag_get, tag_update } from "../../controllers/dashboard/tagController.js";

import { cloudinaryFileUploader } from "../../middleware/FileUploader.js";
import { categoryType_add, categoryType_get, get_category_type  } from "../../controllers/dashboard/categoryTypeController.js";



// category route
router.post('/add-category', admin_middleware, category_add );
router.get('/get-category', admin_middleware, category_get );
router.get('/edit-category/:categorySlug', admin_middleware, category_edit );
router.post('/update-category', admin_middleware, category_update );
router.delete('/delete-category/:categoryId', admin_middleware,category_delete );

// tag route
router.post('/add-tag', admin_middleware, tag_add );
router.get('/get-tag', admin_middleware, tag_get );
router.get('/edit-tag/:tagSlug', admin_middleware, tag_edit );
router.post('/update-tag', admin_middleware, tag_update );
router.delete('/delete-tag/:tagId', admin_middleware, tag_delete );

// article route
router.get('/get-tag-category', admin_middleware, get_tag_category );

router.post('/add-article', admin_middleware, add_article );
// router.post('/add-article', admin_middleware, cloudinaryFileUploader.single('image'), add_article );

router.get('/get-article', admin_middleware, get_article );
router.get('/edit-article/:articleSlug', admin_middleware, edit_article );
router.post('/update-article', admin_middleware, update_article );
router.delete('/delete-artical/:articleId', admin_middleware, delete_article);


// category List route
router.get('/getcategorytype', admin_middleware, get_category_type );
router.post('/add-category-type', admin_middleware, categoryType_add );
 router.get('/get-category-type', admin_middleware, categoryType_get );




export default router;