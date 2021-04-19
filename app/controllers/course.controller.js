const db = require("../models");
const Course = db.course;
const Tutor = db.tutor;
// Create and Save a new course
exports.create = (req, res) => {

  Course.create(req.body)
  .then(function(dbCourse){
      return Tutor.findOneAndUpdate({_id: req.params.id},{$push:{course: dbCourse._id}},{new:true, useFindAndModify: false});
  })
  .then(function(dbTutor){
      res.json(dbTutor);
  })
  .catch(function(err){
      res.json(err);
  });
};

// Retrieve all course from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Course.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving course."
      });
    });
};

// Find a single course with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Course.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found course with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving course with id=" + id });
    });
};

// Update a course by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update course with id=${id}. Maybe course was not found!`
        });
      } else res.status(200).send({ message: "Course was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Course with id=" + id
      });
    });
};

// Delete a Tutor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Course.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete course with id=${id}. Maybe course was not found!`
        });
      } else {
        res.send({
          message: "Course was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete course with id=" + id
      });
    });
};

// Delete all course from the database.
exports.deleteAll = (req, res) => {
  Course.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} course were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all course."
      });
    });
};

// Find all published course
exports.findAllPublished = (req, res) => {
  Tutor.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};