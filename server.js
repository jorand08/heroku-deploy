const dotenv = require("dotenv");
const { app } = require("./app");

//utils
const { initModels } = require("./models/initModels");
const { db } = require("./utils/database.util");

dotenv.config({ path: "./config.env" });

const starServer = async () => {
  try {
    db.authenticate(); //authenticate database
    //Establish the realtion between models
    initModels();
    db.sync(); //synchronize database
  } catch (error) {
    console.log(error);
  }
};

//set server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("express app running!", PORT);
});

starServer();
