exports.commentJsonDataToValidate = (comment) => {
  try {
    return [
      {
        value : comment.content,
        expectedType : "string",
        minLength : 1,
        maxLength : 1000
      }, {
        value : comment.postId,
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