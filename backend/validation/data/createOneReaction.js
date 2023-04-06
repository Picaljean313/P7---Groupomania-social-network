exports.reactionJsonDataToValidate = (reaction) => {
  try {
    return [
      {
        value : reaction.type,
        expectedType : "string",
        minLength : 1,
        maxLength : 100
      }, {
        value : reaction.postId,
        required : false,
        expectedType : "string",
        mask : /^[a-f0-9]+$/,
        minLength : 24,
        maxLength : 24
      }, {
        value : reaction.commentId,
        required : false,
        expectedType : "string",
        mask : /^[a-f0-9]+$/,
        minLength : 24,
        maxLength : 24
      }
    ]
  }
  catch {
    return [
      {
        value : "string",
        expectedType : "number"
      }
    ]
  }
};