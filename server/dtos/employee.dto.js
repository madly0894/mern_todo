module.exports = class EmployeeDto {
   id;
   userId;
   name;
   surname;
   patronymic;
   dateOfBirth;
   age;
   picturePath;
   createdAt;
   updatedAt;

   constructor(model) {
      this.id = model._id;
      this.userId = model.userId;
      this.name = model.name;
      this.surname = model.surname;
      this.patronymic = model.patronymic;
      this.dateOfBirth = model.dateOfBirth;
      this.age = model.age;
      this.picturePath = model.picturePath;
      this.createdAt = model.createdAt;
      this.updatedAt = model.updatedAt;
   }
};
