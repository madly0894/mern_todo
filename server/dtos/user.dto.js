module.exports = class UserDto {
   id;
   name;
   username;
   createdAt;
   updatedAt;
   picturePath;

   constructor(model) {
      this.id = model._id;
      this.name = model.name;
      this.username = model.username;
      this.picturePath = model.picturePath;
      this.createdAt = model.createdAt;
      this.updatedAt = model.updatedAt;
   }
};
