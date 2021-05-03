const db = require("../models/index.js");

module.exports = app => {
    const course = require("../controllers/course.controller.js");
  
    var router = require("express").Router();
  
    // Create a new course
    router.post("/", course.create);

    
    // Retrieve all course
    router.get("/", course.findAll);
  
    // Retrieve a single course with id
    router.get("/:id", course.findOne);
  
    // Update a course with id
    router.put("/:id", course.update);
      
    // Delete a course with id
    router.delete("/:id", course.delete);
  
    // Delete all courses
    router.delete("/", course.deleteAll);
  
    app.use('/api/course', router);
  };
