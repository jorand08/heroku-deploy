const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Comment } = require("../models/comment.model");
const { PostImg } = require("../models/postImg.model");

//utils
const { catchAsync } = require("../utils/catchAsync.util");
const { uploadPostImgs, getPostimgsUrls } = require("../utils/firebase.utils");
const { async } = require("@firebase/util");

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: { status: "active" },
    attributes: ["id", "title", "content", "createdAt", "status"],
    include: [
      { model: User, attributes: ["id", "name"] },
      {
        model: Comment,
        required: false, //apply outer join
        where: { status: "active" },
        attributes: ["id", "comment", "status", "createdAt"],
      },
      {
        model: PostImg,
      },
    ],
  });

  const postWithImgs = await getPostimgsUrls(posts);

  res.status(200).json({
    status: "sucess",
    data: {
      posts: postWithImgs,
    },
  });
});

const createPosts = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { protecSession } = req;

  const newPost = await Post.create({
    title,
    content,
    userId: protecSession.id,
  });

  await uploadPostImgs(req.files, newPost.id);

  res.status(201).json({
    status: "sucess",
    data: { newPost },
  });
});

const updatePosts = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { post } = req;

  //update posts
  await post.update({ title, content });

  res.status(200).json({
    status: "sucess",
    data: { post },
  });
  next();
});

const deletePosts = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.destroy();

  res.status(204).json({ status: "sucess" });
  next();
});

module.exports = {
  getAllPosts,
  createPosts,
  updatePosts,
  deletePosts,
};
