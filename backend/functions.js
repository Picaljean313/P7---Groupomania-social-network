const fs = require('fs');

const response = {
  200: "Ok.",
  400: "Bad request.",
  401: "Unauthorized request.",
  403: "Forbidden request.",
  500: "Server error."
};

exports.response = (res, status) => {
  res.status(status).json({ message : response[status] });
};

exports.unlinkFile = (req, res, status) => {
  try {
    fs.unlink(`images/${req.file.filename}`, () => {
      res.status(status).json({ message : response[status] });
    });
  } catch {
    console.log("Can't unlink file.");
    return res.status(500).json({ message : "Server error." });
  }
};