exports.postFormDataToValidate = (post) => {
  try {
    return [
      {
        value : post,
        expectedType : "string",
        maxLength : 10000
      },
      {
        value : JSON.parse(post),
        expectedType : "object"
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


exports.postJsonDataToValidate = (post) => {
  try {
    return [
      {
        value : post.content,
        expectedType : "string",
        maxLength : 10000
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