import { Post } from "../../models/Post.js";



// Create a new blog post
export const createPost = async (req, res) => {
    console.log(req.body);
  /*  
  const { title, content, imageUrls, tags, category } = req.body;
  try {
    const post = new Post({ title, content, imageUrls, tags, category });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
  */
};



// Get all blog posts
export const getAllPost = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};