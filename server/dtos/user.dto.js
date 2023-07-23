module.exports = class UserDto {
   id;
   name;
   username;
   createdAt;
   updatedAt;

   constructor(model) {
      this.id = model._id;
      this.name = model.name;
      this.username = model.username;
      this.createdAt = model.createdAt;
      this.updatedAt = model.updatedAt;
   }
};
