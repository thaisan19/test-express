const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      Price: String,
      tutorCourses:{
          type: Schema.Types.ObjectId,
          ref: 'Tutor',
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

  const Course = mongoose.model("Course", schema);
  return Course;
};