module.exports = app => {
    const tutors = require("../controllers/tutor.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", tutors.create);
  
    // Retrieve all tutors
    router.get("/", tutors.findAll);
  
    // Retrieve all published tutors
    router.get("/published", tutors.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", tutors.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", tutors.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", tutors.delete);
  
    // Create a new Tutorial
    router.delete("/", tutors.deleteAll);
  
    app.use('/api/tutors', router);
  };