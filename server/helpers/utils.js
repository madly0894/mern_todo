const fs = require('fs');
const path = require('path');
const { DIR, FILE_TYPES } = require('./constants');

module.exports = class Utils {
   static getAge(date) {
      return new Date().getFullYear() - new Date(date).getFullYear();
   }
   static getFileExt(filePath) {
      return path.extname(filePath);
   }
   static isImage(filePath) {
      return FILE_TYPES.includes(this.getFileExt(filePath));
   }
   static deleteFile(path) {
      const dir = `${DIR}/${path}`;
      if (fs.existsSync(dir)) {
         fs.unlinkSync(dir);
      }
   }
   static createFolder() {
      if (!fs.existsSync(DIR)) {
         fs.mkdirSync(DIR);
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
