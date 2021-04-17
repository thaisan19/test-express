const db = require("../models");
const Course = db.courses;
const Tutor = db.tutors;

// Create and Save a new Tutorial
exports.create = async (req, res) => {

    try{
        if (!req.body.name) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }
        const tutor = new Tutor({
            name: req.body.name
        });
        await tutor.save();
        res.status(201).json({success:true, data: tutor});
    }catch(err){
        res.status(400).json({success:false, message:err.message});
    }
  };

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
    try {
        const data = await Tutor.find()
                                   .populate({path: 'coursePublished', select: 'title'});
        res.status(200).json({success: true, data});
     } catch (err) {
        res.status(400).json({success: false, message:err.message});
     }
  };

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Course.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + id });
      });
  };

// Update a Tutorial by the id in the request
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
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
          });
        } else res.send({ message: "Tutorial was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id
        });
      });
  };

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Course.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
          res.send({
            message: "Tutorial was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id
        });
      });
  };

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutor.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Tutorials were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all tutorials."
        });
      });
  };

// Find all published Tutorials
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