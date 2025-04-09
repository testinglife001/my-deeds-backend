import { Article } from "../../models/articleModel.js";


export const home_article_get = async (req,res) => {
    // console.log(req.query);
    let {currentPage,searchValue} = req.query;
    currentPage = parseInt(currentPage);
    const perPage = 6;
    const skipPage = parseInt(currentPage - 1) * perPage;

    let articles = [];

    try {
        const articleCount = await Article.find({}).countDocuments();
        // console.log(articleCount);

        if(searchValue){

        }else{
            articles = await Article.find({}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
        }
        res.status(200).json({
            articles,
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


export const home_tag_category_get = async (req,res) => {
    
    try {
        
        const getCategory = await Article.aggregate([
            {
                $match: {
                    category: {
                        $not: {
                            $size: 0
                        }
                    }
                }
            },
            {
                $unwind: "$category"
            },
            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);
        const getTag = await Article.distinct('tag');
        // console.log(getTag);
        // console.log(getCategory);
        return res.status(200).json({
            allCategory: getCategory,
            allTag: getTag
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }

}


export const old_react_article = async (req, res) => {
    try {
        const oldArticle = await Article.aggregate([
            {
                $match: {}
            },
            {
                $sample: {
                    size: 3
                }
            }
        ])
        const recentArticle = await Article.find({}).limit(3).sort({
            createdAt: -1
        })
        return res.status(200).json({ oldArticle, recentArticle })

    } catch (error) {
        return res.status(500).json({
            errorMessage: {
                error: "Internal server error"
            }
        })
    }
}


export const category_article_get = async (req,res) => {
    // console.log(req.query);

    let {currentPage,categorySlug} = req.query;
    currentPage = parseInt(currentPage);
    const perPage = 6;
    const skipPage = parseInt(currentPage - 1) * perPage;

    try {
        const articleCount = await Article.find({category_slug: categorySlug}).countDocuments();
        // console.log(articleCount);

        
        const articles = await Article.find({category_slug: categorySlug}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
        // console.log(articles);
        
        res.status(200).json({
            categoryArticle : articles,
            perPage,
            categoryArticleCount: articleCount 
        });
        

    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }

}


export const tag_article_get = async (req,res) => {

    let {currentPage,tagSlug} = req.query;
    currentPage = parseInt(currentPage);
    const perPage = 6;
    const skipPage = parseInt(currentPage - 1) * perPage;

    try {
        const articleCount = await Article.find({tag_slug: tagSlug}).countDocuments();
        // console.log(articleCount);

        
        const articles = await Article.find({tag_slug: tagSlug}).skip(skipPage).limit(perPage).sort({ createAt: -1 });
        // console.log(articles);
        
        res.status(200).json({
            tagArticle : articles,
            perPage,
            tagArticleCount: articleCount 
        });
        

    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }

}

