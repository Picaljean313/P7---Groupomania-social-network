exports.commentJsonDataToValidate = (comment) => {
  try {
    return [
      {
        value : comment.content,
        expectedType : "string",
        minLength : 1,
        maxLength : 1000
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