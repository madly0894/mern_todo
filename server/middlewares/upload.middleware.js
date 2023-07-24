const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const Utils = require('../helpers/utils');
const { DIR } = require('../helpers/constants');

//Configuration for Multer
const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      if (!fs.existsSync(DIR)) {
         fs.mkdirSync(DIR);
      }

      cb(null, DIR);
   },
   filename: (req, file, cb) => {
      cb(null, uuid.v4() + Utils.getFileExt(file.originalname));
   },
});
// Multer Filter
const multerFilter = (req, file, cb) => {
   cb(
      !Utils.isImage(file.originalname) && ApiError.BadRequest('Only .png, .jpg and .jpeg format allowed'),
      Utils.isImage(file.originalname),
   );
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
   limits: {
      fileSize: '8mb',
   },
});

module.exports = upload;
