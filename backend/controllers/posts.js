const PostsModel = require ('../models/Posts');
const createOnePost = require ('../validation/data/createOnePost');
const rules = require('../validation/rules');
const functions = require('../functions');

exports.createOnePost = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedPostBody = req.body.post ? true : false;
    if (includedPostBody) {
      const validPostFormData = rules.valid(createOnePost.postFormDataToValidate, req.body.post);
      if (!validPostFormData) return functions.unlinkFile(req, res, 400);
      const validPostJson = rules.valid(createOnePost.postJsonDataToValidate, JSON.parse(req.body.post)); 
      if (!validPostJson) return functions.unlinkFile(req, res, 400);
      const postCreated = new PostsModel ({
        content : JSON.parse(req.body.post).content,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId : req.auth.userId
      });
      await postCreated.save()
        .catch(()=> functions.unlinkFile(req, res, 500));
      res.status(201).json({ message : "Post created." });
    } else {
      const postCreated = new PostsModel ({
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId : req.auth.userId
      });
      await postCreated.save()
        .catch(()=> functions.unlinkFile(req, res, 500));
      res.status(201).json({ message : "Post created." });
    }
  } else {
    const validPostJson = rules.valid(createOnePost.postJsonDataToValidate, req.body); 
    if(!validPostJson) return functions.response(res, 400);
    const postCreated = new PostsModel ({
      content : req.body.content,
      userId : req.auth.userId
    });
    await postCreated.save()
      .catch(()=>  functions.response(res, 500));
    res.status(201).json({ message : "Post created." });
  }
};

exports.getAllPosts = (req, res, next) => {

};

exports.deleteAllPosts = (req, res, next) => {

};

exports.getOnePost = (req, res, next) => {

};

exports.modifyOnePost = (req, res, next) => {

};

exports.deleteOnePost = (req, res, next) => {

};