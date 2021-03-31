module.exports = app => {
    const tutor = require("../controllers/tutor.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", tutor.create);
  
    // Retrieve all Tutorials
    router.get("/", tutor.findAll);
  
    // Retrieve all published Tutorials
    router.get("/published", tutor.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", tutor.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", tutor.update);

    // Update Publish with id
    router.put("/publish/:id", tutor.updatePublishment)
      
    // Delete a Tutorial with id
    router.delete("/:id", tutor.delete);
  
    // Create a new Tutorial
    router.delete("/", tutor.deleteAll);
  
    app.use('/api/tutor', router);
  };