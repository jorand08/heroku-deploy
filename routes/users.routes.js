const express = require("express");
const {
  getAllUsers,
  createUsers,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/users.controller");

//middlewares
const { userExists } = require("../middlewares/users.middleware");
const {
  protecSession,
  protectUsersAccount,
  protectGetAll,
} = require("../middlewares/auth.middlewares");

const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");

//routers
const usersRouter = express.Router();
usersRouter.post("/", createUserValidators, createUsers);
usersRouter.post("/login", login);
//Protecting below endpoints
usersRouter.use(protecSession);

usersRouter.get("/", protectGetAll, getAllUsers);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

module.exports = { usersRouter };
