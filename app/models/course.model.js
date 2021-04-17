const { Schema } = require("mongoose");

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        tutorCourses:{
            type: Schema.Types.ObjectId,
            ref: 'Tutor',
            require: true
        }
      },
      { timestamps: true }
    );
  
    const Course = mongoose.model("Course", schema);
    return Course;
  };