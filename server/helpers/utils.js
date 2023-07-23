const fs = require('fs');
const path = require('path');
const { DIR } = require('./constants');

const getAge = date => new Date().getFullYear() - new Date(date).getFullYear();
const getFileExt = filePath => path.extname(filePath);
const deleteFile = filePath => {
   const dir = DIR + filePath;

   if (fs.existsSync(dir)) {
      fs.unlink(dir, err => {
         if (err) {
            throw err;
         }
      });
   }
};

module.exports = { getAge, getFileExt, deleteFile };
