const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username: {type: String, required: true, unique: true, maxLength: 20, minLength: 3},
      firstname: {type: String, required: true, maxLength: 10, minLength: 1},
      lastname: {type: String, required: true,maxLength:10, minLength:1},
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

//Virtual schema

  schema.virtual("coursePublished", {
    ref: 'Course', //The Model to use
    localField: '_id', //Find in Model, where localField 
    foreignField: 'tutorCourses', // is equal to foreignField
  });
  schema.set('toObject', {virutals: true});
  schema.set('toJSON', {virtuals: true});

  const Tutor = mongoose.model("Tutor", schema);
  return Tutor;
};
