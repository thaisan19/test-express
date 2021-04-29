module.exports = app => {
    const tutor = require("../controllers/tutor.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutor
    router.post("/", tutor.create);
  
    // Retrieve all Tutor
    router.get("/", tutor.findAll);
  
    // Retrieve all published Tutor
    router.get("/published", tutor.findAllPublished);
  
    // Retrieve a single Tutor with id
    router.get("/:id", tutor.findOne);
  
    // Update a Tutor with id
    router.put("/:id", tutor.update);

    // Update Publish with id
    router.put("/publish/:id", tutor.updatePublishment)

    // Update isValid with id
    router.put("/isValid/:id", tutor.updateisValid)
      
    // Delete a Tutor with id
    router.delete("/:id", tutor.delete);
  
    // Create a new Tutor
    router.delete("/", tutor.deleteAll);
  
    app.use('/api/tutor', router);
  };