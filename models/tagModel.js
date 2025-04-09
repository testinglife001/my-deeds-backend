import mongoose from "mongoose";
// const {Schema,model} = require('mongoose');

const tagSchema = new mongoose.Schema({
    tagName : {
        type : String,
        required : true
    },
    tagSlug : {
        type : String,
        required : true
    },
    tagBody : {
        type : String,
        required : true
    }
},{timestamps:true});

// module.exports = model('category',categorySchema);
export const Tag = mongoose.model("tag", tagSchema);
