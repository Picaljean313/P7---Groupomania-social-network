const CommentsModel = require ('../models/Comments');
const UsersModel = require ('../models/Users');
const PostsModel = require ('../models/Posts');
const ReactionsModel = require ('../models/Reactions');
const ReportsModel = require ('../models/Reports');
const createOneComment = require('../validation/data/createOneComment');
const reqQueries = require('../validation/data/reqQueries');
const rules = require('../validation/rules');
const functions = require('../functions');
const id = require('../validation/data/id');
const url = require ('url');

exports.createOneComment = async function (req, res, next) {
  const validCommentJson = rules.valid(createOneComment.commentJsonDataToValidate, req.body); 
  if(!validCommentJson) return functions.response(res, 400);

  let post;
  try {
    post = await PostsModel.findOne({ _id : req.body.postId });
  } catch {
    console.log("Can't find post.");
    return functions.response(res, 500);
  }
  if (post === null) return functions.response(res, 400);

  const commentCreated = new CommentsModel ({
    content : req.body.content,
    postId : req.body.postId,
    userId : req.auth.userId
  });
  try {
    await commentCreated.save()
  } catch {
    console.log("Can't save comment.");
    return functions.response(res, 500);
  }
  
  return res.status(201).json({ message : "Comment created." });
};

exports.getAllComments = async function (req, res, next) {
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "fromUserId", "fromPostId", "reactions"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  const invalidReqQueries = reqQueriesKeys.map(x => allowedQueries.includes(x)).includes(false);
  if (invalidReqQueries) return functions.response(res, 400);

  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  if (!validParams) return functions.response(res, 400);

  const minDate = req.query.minDate ? Date.parse(req.query.minDate) : 0;
  const maxDate = req.query.maxDate ? Date.parse(req.query.maxDate) : Date.now();
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const sort = req.query.sort ? req.query.sort : null;
  const fromUserId = req.query.fromUserId;
  const fromPostId = req.query.fromPostId;
  let comments;

  if (fromUserId && fromPostId) {
    let user;
    try {
      user = await UsersModel.findOne({ _id : fromUserId });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user === null) return functions.response(res, 400);

    let post;
    try {
      post = await PostsModel.findOne({ _id : fromPostId });
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    try {
      comments = await CommentsModel.find({ userId : fromUserId, postId : fromPostId }).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
    } catch {
      console.log("Can't find comments.");
      return functions.response(res, 500);
    }
  }
  
  else if (fromUserId && !fromPostId){
    let user;
    try {
      user = await UsersModel.findOne({ _id : fromUserId });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user === null) return functions.response(res, 400);

    try {
      comments = await CommentsModel.find({ userId : fromUserId }).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
    } catch {
      console.log("Can't find comments.");
      return functions.response(res, 500);
    }
  } 

  else if (!fromUserId && fromPostId){
    let post;
    try {
      post = await PostsModel.findOne({ _id : fromPostId });
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    try {
      comments = await CommentsModel.find({ postId : fromPostId }).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
    } catch {
      console.log("Can't find comments.");
      return functions.response(res, 500);
    }
  } 

  else {
    try {
      comments = await CommentsModel.find().sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
    } catch {
      console.log("Can't find comments.");
      return functions.response(res, 500);
    }  
  }

  if (req.query.reactions === "true"){
    let results;
    try {
      const promises = [];
      for (let i in comments) {
        const promise = ReactionsModel.find({ commentId : comments[i]._id }).lean();
        promises.push(promise);
      }
      results = await Promise.all(promises);
    } catch {
      console.log("Can't find all comments reactions.");
      return functions.response(res, 500);
    }

    for (let i in comments) {
      comments[i].reactions = results[i];
    }
  }

  return res.status(200).json(comments);
};

exports.deleteAllComments = async function (req, res, next) {
  let failedPromises = 0;
  const deletedReactions = ReactionsModel.deleteMany({ commentId : { $exists : true }})
    .catch(() => {
      console.log("Can't delete reactions");
      failedPromises++;
    });
  const deletedReports = ReportsModel.deleteMany({ commentId : { $exists : true }})
  .catch(() => {
    console.log("Can't delete reports");
    failedPromises++;
  });
  await Promise.allSettled([deletedReactions, deletedReports]);
  if (failedPromises !== 0) return functions.response(res, 500);

  try {
    await CommentsModel.deleteMany();
  } catch {
    console.log("Can't delete comments.");
    return functions.response(res, 500);
  }

  return functions.response(res,200);
};

exports.getOneComment = (req, res, next) => {

};

exports.modifyOneComment = (req, res, next) => {

};

exports.deleteOneComment = (req, res, next) => {

};