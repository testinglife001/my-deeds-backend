import { Category } from "../../models/categoryModel.js";
 import { Tag } from "../../models/tagModel.js";
 import formidable from 'formidable';
import { article_validator } from "../../validator/validator.js";
import path from "path";
import fs from 'fs'
import { Article } from "../../models/articleModel.js";



export const get_tag_category = async (req,res) => {
    // console.log('llokkoll');

    try {
         const allTag = await Tag.find({});
        const allCategory = await Category.find({});
        res.status(200).json({
             allTag,
            allCategory
        });
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }

}


export const add_article = async (req,res) => {
    // console.log(req);
    // console.log(req.body);

    // const formData = new formidable.IncomingForm({ multiples: true })

    
    const form = formidable({
        multiples: true
    });

    const {adminId, adminName} = req;

    form.parse(req, function (err, fields, files) {

        if(!err){
            const { title, category, slug, tag, text, image, image_url } = fields;
             console.log(files);
            console.log(image);
             console.log(fields);
            
            const validate = article_validator(fields,files);
            if(validate.validated){
                const categoryName = category.toString().split('-').join(' ');
                const tagName = tag.toString().split('-').join(' ');
                files.image[0].originalFilename = Date.now() + files.image[0].originalFilename;
                
                const __dirname = path.resolve();               
                 const uploadPath = __dirname + `../../frontend/public/articalImage/${files.image[0].originalFilename}`;
                 fs.copyFile(files.image[0].filepath, uploadPath,  
                    async (error) => {
                        if(error){
                             console.log(error);
                            res.status(400).json({
                                errorMessage: {
                                    imageUpload: 'Image upload fail'
                                }
                            });
                        }else{
                             console.log('image upload success');
                             try {
                                await Article.create({
                                    adminId,
                                    adminName,
                                    title: title.toString(),
                                    slug: slug.toString(),
                                    category: categoryName,
                                    category_slug: category.toString(),
                                    tag: tagName,
                                    tag_slug: tag.toString(),
                                    articleText: text.toString(),
                                    image: files.image[0].originalFilename,
                                    image_url: image_url.toString()
                                });
                                res.status(201).json({
                                    successMessage: 'Article add successful'
                                });
                            } catch (error) {
                                console.log(error.message);
                                res.status(500).json({ 
                                    errorMessage: {
                                        error: 'Internal server error'
                                    } 
                                });
                            }
                        }
                    }
                )                

            }else{  
                res.status(400).json({ errorMessage: validate.error });
            }
        }
    })
    

}


export const get_article = async (req,res) => {
    // console.log(req.query);

    const { role, adminId } = req;
    const { currentPage, searchValue } = req.query;

    const perPage = 10;

    const skipPage = parseInt(currentPage - 1) * perPage;

    let articles = [];

    try {
        let articleCount = 0;

        if(searchValue){
            if(role === 'admin'){
                articleCount = await Article.find({}).countDocuments();
                articles = await Article.find({}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
                articles = articles.filter(ar => ar.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            } else {
                articleCount = await Article.find({adminId}).countDocuments();
                articles = await Article.find({adminId}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
                articles = articles.filter(ar => ar.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            }
        } else {
            if(role === 'admin'){
                articleCount = await Article.find({}).countDocuments();
                articles = await Article.find({}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
            } else {
                articleCount = await Article.find({adminId}).countDocuments();
                articles = await Article.find({adminId}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
            }
        }

        res.status(200).json({
            allArticle: articles,
            perPage,
            articleCount
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }

}


export const edit_article = async (req,res) => {
    // console.log(req);

    const {articleSlug} = req.params;

    const {adminId, role} = req;
    // console.log(adminId);
    // console.log(role);

    try {
        const getArticle = await Article.findOne({slug: articleSlug});
        if(getArticle && getArticle.adminId === adminId || getArticle.role ===role ){
            res.status(200).json({editArticle: getArticle});
        } else {
            res.status(404).json({
                errorMessage: {
                    error: 'You can not edit this article'
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }

}



export const update_article = async (req,res) => {
    // console.log("ok");
    // console.log(req.body);

    const { title, category, slug, tag, text, articleId } = req.body;
    const { adminId, role } = req;
    const validate = article_validator(req.body, '');

    if(validate.validated){

        try {
            const getArticle = await Article.findById(articleId);
            if(getArticle && getArticle.adminId===adminId || getArticle.role===role){
                const categoryName = category.toString().split('-').join(' ');
                const tagName = tag.toString().split('-').join(' ');
                await Article.findByIdAndUpdate(articleId, {
                    title: title.toString().trim(),
                    slug: slug.toString().trim(),
                    category: categoryName,
                    category_slug: category.toString().trim(),
                    tag: tagName,
                    tag_slug: tag.toString().trim(),
                    articleText: text.toString().trim()
                })
                res.status(201).json({
                    successMessage: 'Article edit successfull'
                })
            } else{
                res.status(404).json({ 
                    errorMessage: {
                        error: 'You can not edit this article'
                    } 
                });
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }

    } else {
        res.status(400).json({ errorMessage: validate.error });
    }

}


export const delete_article = async (req,res) => {
    const { articleId } = req.params;
    const { adminId, role } = req;
    try {
        const getArticle = await Article.findById(articleId);

        if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {
            await Article.findByIdAndDelete(articleId);
            res.status(201).json({
                successMessage: 'Article delete successfull'
            })

        } else {
            res.status(404).json({
                errorMessage: {
                    error: 'You can not edit this article'
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}


