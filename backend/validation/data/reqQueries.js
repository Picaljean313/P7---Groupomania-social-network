exports.reqQueriesToValidate = (reqQueries) => {
  try {
    return [
      {
        value : reqQueries.minDate,
        required : false,
        expectedType : "string",
        mask : /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/,
        minLength : 24,
        maxLength : 24
      },
      {
        value : Date.parse(reqQueries.minDate),
        required : reqQueries.minDate ? true : false,
        expectedType : "number",
        maxValue : reqQueries.maxDate ? Date.parse(reqQueries.maxDate) : Date.now()
      },
      {
        value : reqQueries.maxDate,
        required : false,
        expectedType : "string",
        mask : /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/,
        minLength : 24,
        maxLength : 24
      },
      {
        value : Date.parse(reqQueries.maxDate),
        required : reqQueries.maxDate ? true : false,
        expectedType : "number",
        maxValue : Date.now()
      },
      {
        value : reqQueries.fromUserId,
        required : false,
        expectedType : "string",
        mask : /^[a-f0-9]+$/,
        minLength : 24,
        maxLength : 24
      },
      {
        value : reqQueries.fromPostId,
        required : false,
        expectedType : "string",
        mask : /^[a-f0-9]+$/,
        minLength : 24,
        maxLength : 24
      },
      {
        value : reqQueries.fromCommentId,
        required : false,
        expectedType : "string",
        mask : /^[a-f0-9]+$/,
        minLength : 24,
        maxLength : 24
      },
      {
        value : reqQueries.reactions,
        required : false,
        expectedType : "string",
        expectedValue : ["true", "false"]
      },
      {
        value : reqQueries.comments,
        required : false,
        expectedType : "string",
        expectedValue : ["true", "false"]
      },
      {
        value : reqQueries.commentsReactions,
        required : false,
        expectedType : "string",
        expectedValue : ["true", "false"]
      },
      {
        value : reqQueries.limit,
        required : false,
        expectedType : "string",
        mask : /^[1-9]{1}[0-9]?$/,
        maxLength : 2
      },
      {
        value : reqQueries.sort,
        required : false,
        expectedType : "string",
        expectedValue : ["asc", "desc"]
      },
      {
        value : reqQueries.activity,
        required : false,
        expectedType : "string",
        expectedValue : ["true", "false"]
      },
      {
        value : reqQueries.userData,
        required : false,
        expectedType : "string",
        expectedValue : ["true", "false"]
      },
      {
        value : reqQueries.commentsUserData,
        required : false,
        expectedType : "string",
        expectedValue : ["true", "false"]
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