const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const Utils = require('../helpers/utils');
const { FILE_TYPES, DIR } = require('../helpers/constants');

//Configuration for Multer
const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      if (!fs.existsSync(DIR)) {
         fs.mkdir(DIR, err => {
            if (err) {
               throw err;
            }
         });
      }
      cb(null, DIR);
   },
   filename: (req, file, cb) => {
      cb(null, uuid.v4() + Utils.getFileExt(file.originalname));
   },
});
// Multer Filter
const multerFilter = (req, file, cb) => {
   if (FILE_TYPES.includes(Utils.getFileExt(req.body?.picture || file.originalname))) {
      cb(null, true);
   } else {
      cb(ApiError.BadRequest('Incorrect data', [{ picture: 'Only .png, .jpg and .jpeg format allowed' }]), false);
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
