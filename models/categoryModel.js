import mongoose from "mongoose";
// const {Schema,model} = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    categorySlug : {
        type : String,
        required : true
    },
    categoryBody : {
        type : String,
        required : true
    }
},{timestamps:true});

// module.exports = model('category',categorySchema);
export const Category = mongoose.model("category", categorySchema);
