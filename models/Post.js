import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrls: [String],
  tags: [String],
  category: String
}, { timestamps: true });

// module.exports = mongoose.model('Post', postSchema);
export const Post = mongoose.model('Post', postSchema);
