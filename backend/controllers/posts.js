const PostsModel = require ('../models/Posts');
const UsersModel = require ('../models/Users');
const CommentsModel = require('../models/Comments');
const ReactionsModel = require('../models/Reactions');
const ReportsModel = require ('../models/Reports');
const createOnePost = require ('../validation/data/createOnePost');
const rules = require('../validation/rules');
const functions = require('../functions');
const reqQueries = require('../validation/data/reqQueries');
const variables = require('../variables');
const id = require('../validation/data/id');
const url = require ('url');

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

exports.getAllPosts = async function (req, res, next) {
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "fromUserId", "reactions", "comments", "commentsReactions"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  for (let reqQueryKey of reqQueriesKeys){
    if (!allowedQueries.includes(reqQueryKey)) return functions.response(res, 400);
  };
  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  if (!validParams) return functions.response(res, 400);
  if (req.query.commentsReactions === "true" && req.query.comments !== "true") return functions.response(res, 400);
  const minDate = req.query.minDate ? Date.parse(req.query.minDate) : 0;
  const maxDate = req.query.maxDate ? Date.parse(req.query.maxDate) : Date.now();
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const sort = req.query.sort ? req.query.sort : null;
  const fromUserId = req.query.fromUserId;
  let posts;
  if (fromUserId){
    const user = await UsersModel.findOne({ _id : fromUserId })
      .catch(()=> functions.response(res, 500));
    if (user === null) return functions.response(res, 400);
    posts = await PostsModel.find({ userId : fromUserId }).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean()
      .catch(()=> functions.response(res, 500));
  } else {
    posts = await PostsModel.find().sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean()
      .catch(()=> functions.response(res, 500));    
  }
  if (req.query.reactions === "true"){
    for (let post of posts) {
      post.reactions = await ReactionsModel.find({ postId : post._id }).lean()
        .catch(()=> functions.response(res, 500)); 
    }
  }
  if (req.query.comments === "true"){
    for (let post of posts) {
      post.comments = await CommentsModel.find({ postId : post._id }).lean()
        .catch(()=> functions.response(res, 500)); 
      if (req.query.commentsReactions === "true") {
        for (let comment of post.comments) {
          comment.reactions = await ReactionsModel.find({ commentId : comment._id }).lean()
            .catch(()=> functions.response(res, 500)); 
        }
      }
    }
  }
  res.status(200).json(posts);
};

exports.deleteAllPosts = async function (req, res, next) {
  const imagesToDelete = [];
  const posts = await PostsModel.find()
    .catch(()=> functions.response(res, 500));
  for (let post of posts){
    if (post.imageUrl){
      imagesToDelete.push(post.imageUrl.split('images/')[1]);
    }
  };
  const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
  function unlinkFile (file) {
    return fs.promises.unlink(`images/${file}`).catch(()=> functions.response(res, 500));
  };
  const promises =[];
  for (let image of imagesToDelete){
    if (image !== defaultImageToKeep){
    promises.push(unlinkFile(image));}
  };
  const deletedPosts = PostsModel.deleteMany()
    .catch(()=> functions.response(res, 500));
  const deletedComments = CommentsModel.deleteMany()
    .catch(()=> functions.response(res, 500));
  const deletedReactions = ReactionsModel.deleteMany()
    .catch(()=> functions.response(res, 500));
  const deletedReports = ReportsModel.deleteMany()
    .catch(()=> functions.response(res, 500));
  promises.push(deletedPosts, deletedComments, deletedReactions, deletedReports);
  await Promise.all(promises);
  res.status(200).json({ message : "Ok." })
};

exports.getOnePost = async function (req, res, next) {
  const allowedQueries = ["reactions", "comments", "commentsReactions"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  for (let reqQueryKey of reqQueriesKeys){
    if (!allowedQueries.includes(reqQueryKey)) return functions.response(res, 400);
  };
  const validreqQueries = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  const invalidPostId = !rules.valid(id.idToValidate, req.params.postId);
  if (!validreqQueries || invalidPostId) return functions.response(res, 400);
  const post = await PostsModel.findOne({ _id : req.params.postId }).lean()
    .catch(()=> functions.response(res, 500));
  if (post === null) return functions.response(res, 400);
  if (req.query.commentsReactions === "true" && req.query.comments !== "true") return functions.response(res, 400);
  if (req.query.reactions === "true"){
    post.reactions = await ReactionsModel.find({ postId : post._id }).lean()
      .catch(()=> functions.response(res, 500)); 
  }
  if (req.query.comments === "true"){
    post.comments = await CommentsModel.find({ postId : post._id }).lean()
      .catch(()=> functions.response(res, 500)); 
    if (req.query.commentsReactions === "true") {
      for (let comment of post.comments) {
        comment.reactions = await ReactionsModel.find({ commentId : comment._id }).lean()
          .catch(()=> functions.response(res, 500)); 
      }
    }
  }
  res.status(200).json(post);
};

exports.modifyOnePost = (req, res, next) => {

};

exports.deleteOnePost = (req, res, next) => {

};