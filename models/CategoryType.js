import mongoose from "mongoose";
// const {Schema,model} = require('mongoose');

const categoryTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    slug: {
        type : String,
        required : true
      },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryType",
        default: null,
      },
    children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CategoryType",
        },
      ],
    },
    {timestamps:true}
);

// module.exports = model('category',categorySchema);
export const CategoryType = mongoose.model("categoryType", categoryTypeSchema);
