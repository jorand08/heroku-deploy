const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

//model
const { PostImg } = require("../models/postImg.model");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROYECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

//Storage service
const storage = getStorage(firebaseApp);

const uploadPostImgs = async (imgs, postId) => {
  // Map async -> Async operations with arrays
  const imgsPromises = imgs.map(async (img) => {
    //Create fire base reference
    const [originalName, ext] = img.originalname.split(".");

    const filename = `post/${postId}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    //upload image to firebase
    const result = await uploadBytes(imgRef, img.buffer);

    await PostImg.create({
      postId,
      imgUrl: result.metadata.fullPath,
    });
  });
  await Promise.all(imgsPromises);
};

const getPostimgsUrls = async (posts) => {
  //Loop through posts to get to the postImgs
  const postWithImgspromises = posts.map(async (post) => {
    //get imgs URLS
    const postImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);
      postImg.imgUrl = imgUrl;

      return postImg;
    });

    //resolve imgs urls
    const postImgs = await Promise.all(postImgsPromises);

    //update old postimgs array with new array
    post.postImgs = postImgs;
    return post;
  });
  return await Promise.all(postWithImgspromises);
};

module.exports = { storage, uploadPostImgs, getPostimgsUrls };
