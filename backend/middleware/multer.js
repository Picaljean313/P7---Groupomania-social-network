const multer = require('multer');
const rules = require('../validation/rules');
const multerData = require('../validation/data/multer');
const functions = require('../functions');

const mimetypes = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const uploadFilter = (req, file, callback) => {
  const validFile = rules.valid(multerData.fileToValidate, file);
  if (validFile){
    callback(null, true);
  } else {
    callback(null,false);
    req.invalidFile = true;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = mimetypes[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage : storage, fileFilter : uploadFilter, limits : { files : 1, fields : 1 } }).single('image');

module.exports = (req, res, next) => {
  upload(req, res, error => {
    if (error || req.invalidFile) return functions.response(res, 400);
    next();
  })
};


