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
      
    // Delete a Tutor with id
    router.delete("/delete/:id", tutor.delete);
  
    // Delete all Tutor
    router.delete("/", tutor.deleteAll);

    //send gmail to tutor route
    router.post('/sendEmail', tutor.sendEmailToTutor);

    //verify gmail route
    router.post('/tutorVerify/:uniqueString', tutor.tutorVerify);

    //login route
    router.post('/tutorLogin', tutor.tutorLogin);

    //refresh-token route
    router.post('/refresh-token', tutor.tutorRefreshToken);

    //logout route
    router.delete('/tutorLogout', tutor.tutorLogout);
  
    app.use('/api/tutor', router);
  };