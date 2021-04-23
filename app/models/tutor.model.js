const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username: {type: String, required: true, unique: true, maxLength: 20, minLength: 3},
      firstname: {type: String, required: true, maxLength: 10, minLength: 3},
      lastname: {type: String, required: true,maxLength:10, minLength:3},
      password: {type: String, default: ""},
      phonenumber: {type: Number, required: true, max:999999999, min:10000000},
      email: {type: String, required: true, unique: true},
      expertise: {type: Array , required: true },
      //schedule: {type: Array}
      aboutme: {type: String, required: true},
      achievement: {type: String, required: true},
      //profile: {type: Buffer, require},
      //cv: {type: Buffer, require},
      published: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutor = mongoose.model("tutor", schema);
  return Tutor;
};