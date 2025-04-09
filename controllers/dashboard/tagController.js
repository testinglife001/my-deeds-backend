import { Tag } from "../../models/tagModel.js";



export const tag_add = async (req, res) => {
    // console.log('call');

    const { tagName, tagBody } = req.body;

    const error = {};

    // console.log(req.body);

    
    if (!tagName) {
        error.tagName = 'Please provide tag name';
    }
    if (!tagBody) {
        error.tagBody = 'Please provide tag description';
    }

    if (Object.keys(error).length == 0) {
        const tagSlug = tagName.trim().split(' ').join('-');
        try {
            const checkTag = await Tag.findOne({ tagSlug });
            if(checkTag){
                res.status(404).json({
                    errorMessage: {
                        error: 'Already added tag'
                    }
                })
            } else {
                await Tag.create({
                    tagName: tagName.trim(),
                    tagSlug,
                    tagBody
                })
                res.status(201).json({
                    successMessage: 'Tag add successfull'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    } else {
        res.status(404).json({ errorMessage: error });
    }
}


export const tag_get = async (req, res) => {
    // console.log(req);
    const { page, searchValue } = req.query;
    const perPage = 8;
    const skipPage = parseInt(page - 1) * perPage;
    if (searchValue === 'undefined' || !searchValue) {
        try {
            const tagCount = await Tag.find({}).countDocuments();
            // console.log(tagCount);
            const getTag = await Tag.find({}).skip(skipPage).limit(perPage).sort({ createdAt: -1 });
            // console.log(getTag);
            res.status(200).json({
                allTag: getTag,
                perPage,
                tagCount
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
            const tagCount = await Tag.find({}).countDocuments();
            let getTag = await Tag.find({});
            getTag = getTag.filter(t => t.tagName.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            res.status(200).json({
                allTag: getTag,
                perPage,
                tagCount
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


export const tag_edit = async (req, res) => {
    const {tagSlug} = req.params;
    try {
        const editTag = await Tag.findOne({tagSlug});
        res.status(200).json({
            editTag
        });
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}


export const tag_update = async (req, res) => {
    const {tagId} = req.params;
    const { tagName, tagBody } = req.body;

    const error = {};

    if (!tagName) {
        error.tagName = 'Please provide tag name';
    }
    if (!tagBody) {
        error.tagBody = 'Please provide tag description';
    }

    if (Object.keys(error).length == 0) {
        const tagSlug = tagName.trim().split(' ').join('-');
        try {
             
                await Tag.findByIdAndUpdate( tagId, {
                    tagName: tagName.trim(),
                    tagSlug,
                    tagBody
                })
                res.status(200).json({
                    successMessage: 'Tag update successfull'
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


export const tag_delete = async (req, res) => {
    const tagId = req.params.tagId;
    try {
        await Tag.findByIdAndDelete(tagId);
        res.status(200).json({
            successMessage: 'Tag delete success'
        });
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}


