// const path = require("path");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const destPath = path.join(__dirname, "..", "imgs");
//     console.log(destPath);
//     cb(null, destPath);
//   },
//   filename: (req, file, cb) => {
//     const [originalName, ext] = file.originalname.split(".");
//     const filename = `${originalName}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { upload };
