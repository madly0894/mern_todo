const fs = require('fs');
const path = require('path');
const { DIR } = require('./constants');

module.exports = class Utils {
   static getAge(date) {
      return new Date().getFullYear() - new Date(date).getFullYear();
   }
   static getFileExt(filePath) {
      return path.extname(filePath);
   }
   static deleteFile(path) {
      const dir = `${DIR}/${path}`;
      if (fs.existsSync(dir)) {
         fs.unlink(dir, err => {
            if (err) {
               throw err;
            }
         });
      }
   }
   static getFileName(name) {
      const arr = name.split('/');
      return arr[arr.length - 1];
   }
   static setImageUrl(path) {
      return (path && `${process.env.API_URL}/images/${this.getFileName(path)}`) ?? null;
   }
};
