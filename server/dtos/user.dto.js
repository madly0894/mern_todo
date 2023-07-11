module.exports = class UserDto {
   id;
   name;
   username;

   constructor(model) {
      this.id = model._id;
      this.name = model.name;
      this.username = model.username;
   }
};
