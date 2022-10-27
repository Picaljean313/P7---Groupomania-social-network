exports.reactionJsonDataToValidate = (reaction) => {
  try {
    return [
      {
        value : reaction.type,
        expectedType : "string",
        minLength : 1,
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