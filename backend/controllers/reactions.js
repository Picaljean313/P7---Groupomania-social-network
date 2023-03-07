const ReactionsModel = require ('../models/Reactions');
const UsersModel = require ('../models/Users');
const PostsModel = require ('../models/Posts');
const CommentsModel = require ('../models/Comments');
const createOneReaction = require ('../validation/data/createOneReaction');
const modifyOneReaction = require ('../validation/data/modifyOneReaction');
const reqQueries = require('../validation/data/reqQueries');
const rules = require('../validation/rules');
const functions = require('../functions');
const id = require('../validation/data/id');
const url = require ('url');

exports.createOneReaction = async function (req, res, next) {
  const validReactionJson = rules.valid(createOneReaction.reactionJsonDataToValidate, req.body); 
  if(!validReactionJson) return functions.response(res, 400);

  const isCommentId = req.body.commentId ? true : false;
  const isPostId = req.body.postId ? true : false;

  if ((isCommentId && isPostId) || (!isCommentId && !isPostId)) return functions.response(res, 400);

  if (isPostId) {
    let post;
    try {
      post = await PostsModel.findOne({ _id : req.body.postId });
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    let reaction;
    try {
      reaction = await ReactionsModel.findOne({ userId : req.auth.userId, postId : post._id });
    } catch {
      console.log("Can't find reaction.");
      return functions.response(res, 500);
    }
    if (reaction !== null) return functions.response(res, 400);
  }

  if (isCommentId) {
    let comment;
    try {
      comment = await CommentsModel.findOne({ _id : req.body.commentId });
    } catch {
      console.log("Can't find comment.");
      return functions.response(res, 500);
    }
    if (comment === null) return functions.response(res, 400);

    let reaction;
    try {
      reaction = await ReactionsModel.findOne({ userId : req.auth.userId, commentId : comment._id });
    } catch {
      console.log("Can't find reaction.");
      return functions.response(res, 500);
    }
    if (reaction !== null) return functions.response(res, 400);
  }

  const reactionCreated = new ReactionsModel ({
    type : req.body.type,
    postId : req.body.postId,
    commentId : req.body.commentId,
    userId : req.auth.userId
  });
  let reaction;
  try {
    reaction = await reactionCreated.save();
  } catch {
    console.log("Can't save reaction.");
    return functions.response(res, 500);
  }
  
  return res.status(201).json({reaction : reaction});
};

exports.getAllReactions = async function (req, res, next) {
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "fromUserId", "fromPostId", "fromCommentId"]; 
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
  const fromCommentId = req.query.fromCommentId;
  const searchParam = {};

  if (fromPostId && fromCommentId) return functions.response(res, 400);

  if (fromUserId) {
    let user;
    try {
      user = await UsersModel.findOne({ _id : fromUserId });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user === null) return functions.response(res, 400);

    searchParam.userId = fromUserId;
  }

  if (fromPostId) {
    let post;
    try {
      post = await PostsModel.findOne({ _id : fromPostId });
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    searchParam.postId = fromPostId;
  }

  if (fromCommentId) {
    let comment;
    try {
      comment = await CommentsModel.findOne({ _id : fromCommentId });
    } catch {
      console.log("Can't find comment.");
      return functions.response(res, 500);
    }
    if (comment === null) return functions.response(res, 400);

    searchParam.commentId = fromCommentId;
  }

  let reactions;
  try {
    reactions = await ReactionsModel.find(searchParam).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
  } catch {
    console.log("Can't find comments.");
    return functions.response(res, 500);
  } 

  return res.status(200).json(reactions);
};

exports.deleteAllReactions = async function (req, res, next) {
  try {
    await ReactionsModel.deleteMany();
  } catch {
    console.log("Can't delete reactions.");
    return functions.response(res, 500);
  }

  return functions.response(res,200);
};

exports.getOneReaction = async function (req, res, next) {
  const invalidReactionId = !rules.valid(id.idToValidate, req.params.reactionId);
  if (invalidReactionId) return functions.response(res, 400);

  let reaction;
  try {
    reaction = await ReactionsModel.findOne({ _id : req.params.reactionId });
  } catch {
    console.log("Can't find reaction.");
    return functions.response(res, 500);
  }
  if (reaction === null) return functions.response(res, 400);

  return res.status(200).json(reaction);
};

exports.modifyOneReaction = async function (req, res, next) {
  const invalidReactionId = !rules.valid(id.idToValidate, req.params.reactionId);
  if (invalidReactionId) return functions.response(res, 400);

  let reaction;
  try {
    if (!req.auth.isAdmin){
      reaction = await ReactionsModel.findOne({ _id : req.params.reactionId, userId : req.auth.userId});
    } else {
      reaction = await ReactionsModel.findOne({ _id : req.params.reactionId});
    }
  } catch {
    console.log("Can't find reaction.");
    return functions.response(res, 500);
  }
  if (reaction === null) return functions.response(res, 400);

  const validReactionJson = rules.valid(modifyOneReaction.reactionJsonDataToValidate, req.body);
  if (!validReactionJson) return functions.response(res, 400);

  if (req.body.type !== reaction.type) {
    try {
      await ReactionsModel.updateOne({ _id : req.params.reactionId }, { type : req.body.type });
    } catch {
      console.log("Can't update reaction.");
      return functions.response(res, 500);
    }
  }
  else return functions.response(res, 400);
  
  return functions.response(res, 200);
};

exports.deleteOneReaction = async function (req, res, next) {
  const invalidReactionId = !rules.valid(id.idToValidate, req.params.reactionId);
  if (invalidReactionId) return functions.response(res, 400);

  let reaction;
  try {
    if (!req.auth.isAdmin){
      reaction = await ReactionsModel.findOne({ _id : req.params.reactionId, userId : req.auth.userId});
    } else {
      reaction = await ReactionsModel.findOne({ _id : req.params.reactionId});
    }
  } catch {
    console.log("Can't find reaction.");
    return functions.response(res, 500);
  }
  if (reaction === null) return functions.response(res, 400);

  try {
    await ReactionsModel.deleteOne({ _id : req.params.reactionId });
  } catch {
    console.log("Can't delete reaction.");
    return functions.response(res, 500);
  }

  return functions.response(res, 200);
};