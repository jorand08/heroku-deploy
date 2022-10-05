const { User } = require("./user.model");
const { Post } = require("./post.model");
const { Comment } = require("./comment.model");
const { PostImg } = require("./postImg.model");

const initModels = () => {
  //1User <--> M Post
  User.hasMany(Post, { foreignKey: "userId" });
  Post.belongsTo(User);
  //1User <--> M comment
  User.hasMany(Comment, { foreignKey: "userId" });
  Comment.belongsTo(User);
  //1post <--> M Comment
  Post.hasMany(Comment, { foreignKey: "postId" });
  Comment.belongsTo(Post);
  //post <--> M imgs
  Post.hasMany(PostImg, { foreignKey: "postId" });
  PostImg.belongsTo(Post);
};

module.exports = { initModels };
