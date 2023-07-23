const fs = require('fs');
const path = require('path');
const express = require('express');
const getAge = date => new Date().getFullYear() - new Date(date).getFullYear();

const getFileExt = filePath => path.extname(filePath);

const deleteFile = filePath => {
   const file = path.join(process.cwd(), 'public', 'images', filePath);

   if (fs.existsSync(file)) {
      fs.unlink(file, err => {
         if (err) {
            throw err;
         }
      });
   }
};

module.exports = { getAge, getFileExt, deleteFile };
