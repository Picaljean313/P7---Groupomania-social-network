exports.reportJsonDataToValidate = (report) => {
  try {
    return [
      {
        value : report.postId,
        required : false,
        expectedType : "string",
        mask : /^[a-f0-9]+$/,
        minLength : 24,
        maxLength : 24
      }, {
        value : report.commentId,
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