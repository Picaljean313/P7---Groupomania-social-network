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