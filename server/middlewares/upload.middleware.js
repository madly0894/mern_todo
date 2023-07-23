const multer = require('multer');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const { getFileExt } = require('../helpers/utils');
const { FILE_TYPES } = require('../helpers/constants');

//Configuration for Multer
const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/images/');
   },
   filename: (req, file, cb) => {
      cb(null, uuid.v4() + getFileExt(file.originalname));
   },
});
// Multer Filter
const multerFilter = (req, file, cb) => {
   if (FILE_TYPES.includes(getFileExt(req.body.picture || file.originalname))) {
      cb(null, true);
   } else {
      cb(null, false);
      // ApiError.BadRequest('Incorrect data', [{ picture: 'Only .png, .jpg and .jpeg format allowed' }])
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
   limits: {
      fileSize: '8mb',
   },
});

module.exports = upload;
