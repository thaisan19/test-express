const { text } = require("body-parser");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      coursename: {type: String, required: true},
      price: {type: String, required: true}
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Course = mongoose.model("course", schema);
  return Course;
};