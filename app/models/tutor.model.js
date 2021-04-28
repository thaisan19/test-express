const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username: {type: String, required: true, unique: true, maxLength: 20, minLength: 3},
      firstname: {type: String, required: true, maxLength: 10, minLength: 3},
      lastname: {type: String, required: true,maxLength:10, minLength:3},
      password: {type: String, default: ""},
      phonenumber: {type: Number, required: true, max:999999999, min:10000000, unique: true},
      email: {type: String, required: true, unique: true},
      expertise: {type: Array , required: true },
      dayofweek: {type: Array, required: true},
      timeofday: {type: Array, require:true},
      aboutme: {type: String, required: true},
      achievement: {type: String, required: true},
      profile: {type: Buffer },
      cv: {type: Buffer},
      published: Boolean,
      uniqueString: {
        type: String,
        require: true
      },
      isValid: {
        type: Boolean,
        require: true
      }
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