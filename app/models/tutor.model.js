module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: String,
      },
      { timestamps: true }
    );
  
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