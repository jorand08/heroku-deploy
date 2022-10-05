const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

//Routers
const { usersRouter } = require("./routes/users.routes");
const { postsRouter } = require("./routes/posts.routes");
const { commentsRouter } = require("./routes/comments.routes");

const { globalErrorHandler } = require("./controllers/error.controller");

// init our Express
const app = express();

// Enable Express app to receive JSON data
app.use(express.json());

// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));

//Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);

//Global error handelr
app.use(globalErrorHandler);

//Catch non-existing endpoints -- preguntar!
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
