const UserDto = require('./user.dto');
module.exports = class EmployeeDto {
   id;
   userId;
   user;
   name;
   surname;
   patronymic;
   secretWord;
   dateOfBirth;
   age;

   constructor(model) {
      this.id = model._id;
      this.userId = model.userId;
      this.user = model.user;
      this.name = model.name;
      this.surname = model.surname;
      this.patronymic = model.patronymic;
      this.secretWord = model.secretWord;
      this.dateOfBirth = model.dateOfBirth;
      this.age = model.age;
   }
};
