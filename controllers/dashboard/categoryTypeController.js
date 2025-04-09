import { CategoryType } from "../../models/CategoryType.js";


export const get_category_type = async (req, res) => {
    try {
        const allCategoryType = await CategoryType.find({});
        res.status(200).json(
            {
                allCategoryType
            }
        )
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        }); 
    }
}



export const categoryType_add = async (req, res) => {
     console.log(req.body);

    // const { categoryName, categoryBody } = req.body;
    const { name, parentId } = req.body;
    console.log("🔧 Received Data:", { name, parentId });

    const error = {};

    if (!name) {
        error.name = 'Please provide category type name';
    }
    

    if (Object.keys(error).length == 0) {
        const slug = name.trim().split(' ').join('-');
        try {
            const checkCategory = await CategoryType.findOne({ slug });
            if(checkCategory){
                res.status(404).json({
                    errorMessage: {
                        error: 'Already added category type'
                    }
                })
            } else {
                // const savedCategory = await CategoryType.create({
                //    name: name.trim(),
                //    slug,
                //    parentId: parentId || null
                // })
                // if (parentId) {
                //    await CategoryType.findByIdAndUpdate(parentId, {
                //      $push: { children: savedCategory._id },
                //    });
                // }
                const newCategory = new CategoryType({ name, slug, parentId: parentId || null });
                const savedCategory = await newCategory.save();
                console.log("✅ New Category Saved:", savedCategory);

                // Step 2: If parentId exists, update parent's children array
                // if (parentId) {
                // await Category.findByIdAndUpdate(
                //    parentId,
                //    { $push: { children: savedCategory._id } },
                //    { new: true } // optional, returns the updated doc if needed
                // );
                // }
                if (parentId) {
                    const updatedParent = await CategoryType.findByIdAndUpdate(
                      parentId,
                      { $push: { children: savedCategory._id } },
                      { new: true } // return updated parent
                    );
              
                    if (!updatedParent) {
                      console.warn("⚠️ Parent category not found:", parentId);
                    } else {
                      console.log("📦 Updated Parent Category:", updatedParent);
                    }
                }
                res.status(201).json(
                     {
                        successMessage: 'Category type add successfull',
                        savedCategory
                     },
                    // savedCategory
                )
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    } else {
        res.status(400).json({ errorMessage: error });
    }

}

  

export const categoryType_get = async (req, res) => {
     console.log(req);
    const { page, searchValue } = req.query;
    const perPage = 8;
    const skipPage = parseInt(page - 1) * perPage;
    if (searchValue === 'undefined' || !searchValue) {
        try {
            const categoryTypeCount = await CategoryType.find({}).countDocuments();
            // console.log(categoryCount);
            const getCategoryType = await CategoryType.find({}).skip(skipPage).limit(perPage).sort({ createdAt: -1 });
            // console.log(getCategory);
            res.status(200).json({
                allCategoryType: getCategoryType,
                perPage,
                categoryTypeCount
            });
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            });            
        }
    } else {
        try {
            const categoryTypeCount = await CategoryType.find({}).countDocuments();
            let getCategoryType = await CategoryType.find({});
            getCategoryType = getCategoryType.filter(c => c.name.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            res.status(200).json({
                allCategoryType: getCategoryType,
                perPage,
                categoryTypeCount
            });
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            }); 
        }
    }
}


export const category_edit = async (req, res) => {
    const {categorySlug} = req.params;
    try {
        const editCategory = await Category.findOne({categorySlug});
        res.status(200).json({
            editCategory
        });
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}


export const category_update = async (req, res) => {
    const {categoryId} = req.params;
    const { categoryName, categoryBody } = req.body;

    const error = {};

    if (!categoryName) {
        error.categoryName = 'Please provide category name';
    }
    if (!categoryBody) {
        error.categoryBody = 'Please provide category description';
    }

    if (Object.keys(error).length == 0) {
        const categorySlug = categoryName.trim().split(' ').join('-');
        try {
             
                await Category.findByIdAndUpdate( categoryId, {
                    categoryName: categoryName.trim(),
                    categorySlug,
                    categoryBody
                })
                res.status(200).json({
                    successMessage: 'Category update successfull'
                })
             
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    } else {
        res.status(400).json({ errorMessage: error });
    }
}



export const category_delete = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({
            successMessage: 'Category delete success'
        });
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}


