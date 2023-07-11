module.exports = class EmployeeDto {
   id;
   userId;
   name;
   surname;
   patronymic;
   secretWord;
   dateOfBirth;
   age;

   constructor(model) {
      this.id = model._id;
      this.userId = model.userId;
      this.name = model.name;
      this.surname = model.surname;
      this.patronymic = model.patronymic;
      this.secretWord = model.secretWord;
      this.dateOfBirth = model.dateOfBirth;
      this.age = model.age;
   }
};
