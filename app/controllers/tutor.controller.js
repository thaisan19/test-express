const db = require("../models");
const Tutor = db.tutor;
var generator = require('generate-password');
// Create and Save a new Tutor
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutor
  const tutor = new Tutor({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      expertise: req.body.expertise,
      dayofweek: req.body.dayofweek,
      timeofday: req.body.timeofday,
      aboutme: req.body.aboutme,
      achievement: req.body.achievement,
      profile: req.body.profile,
      cv: req.body.cv,
      published: req.body.published ? req.body.published : false,
      uniqueString: req.body.uniqueString,
      isValid: req.body.isValid ? req.body.isValid : false,
  });
//create random string
  const randString = () => {
    const len = 8
    let randStr = ''
    for (let i=0; i<len; i++) {
        const ch = Math.floor((Math.random() *8) +1)
        randStr += ch
    }
    return randStr
}

const uniqueString = randString()
const isValid = false
tutor.uniqueString = uniqueString
tutor.isValid = isValid
  
  // Save Tutor in the database
  tutor
    .save(tutor)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutor from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Tutor.find(condition)
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

// Find one tutor with courses
exports.findOne = (req, res) => {

  Tutor.findOne({_id: req.params.id})
  .populate("courses")
  .then(function(dbTutor){
    res.json(dbTutor);
  })
  .catch(function(err){
    res.json(err);
  });
};
// Find a single Tutor with an id
/* exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutor.findById(id)
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
};*/

// Update a Tutor by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Tutor.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.status(200).send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

//updatePublishment
exports.updatePublishment = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  var Newpassword = generator.generate({length:20, numbers: true, uppercase: true});
  Tutor.findByIdAndUpdate(id, {published:true, password: Newpassword}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.status(200).send({ message: "Tutorial was updated successfully."});
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

//updateisValid
exports.updateisValid = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  Tutor.findByIdAndUpdate(id, {isValid:true}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.status(200).send({ message: "Tutorial was updated successfully."});
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutor.findByIdAndRemove(id)
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

// Delete all Tutor from the database.
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

// Find all published Tutor
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