const express = require("express");
const {
  getAllPosts,
  createPosts,
  updatePosts,
  deletePosts,
} = require("../controllers/posts.controller");

//middlewares
const { postsExists } = require("../middlewares/posts.middleware");
const {
  protecSession,
  protectPost,
} = require("../middlewares/auth.middlewares");

const {
  createPostValidators,
} = require("../middlewares/validators.middlewares");

//utils
const { upload } = require("../utils/multer.util");

const postsRouter = express.Router();

postsRouter.use(protecSession);

postsRouter.get("/", getAllPosts);
// Get only 1 img
// postsRouter.post("/", upload.single("postImg"), createPosts);
postsRouter.post("/", upload.array("postImg", 3), createPosts);
postsRouter.patch("/:id", postsExists, protectPost, updatePosts);
postsRouter.delete("/:id", postsExists, protectPost, deletePosts);

module.exports = { postsRouter };
