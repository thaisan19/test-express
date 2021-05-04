const dotenv = require('dotenv');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const client = require('../helpers/init_redis');
const { 
        signAccessToken,
        signRefreshToken,
        verifyRefreshToken } = require('../helpers/jwt_helper');
dotenv.config();
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
const role = "tutorer"
tutor.role = role
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

// Retrieve all tutor from the database.
exports.findAll = async (req, res) => {
  try {
    const data = await Tutor.find()
                            .populate({path: 'coursePublished', select: 'title'});
    res.status(200).json({success: true, data});
 } catch (err) {
    res.status(400).json({success: false, message:err.message});
 }
};

// Find one tutor with courses
/*exports.findOne = (req, res) => {

  Tutor.findOne({_id: req.params.id})
  .populate("courses")
  .then(function(dbTutor){
    res.json(dbTutor);
  })
  .catch(function(err){
    res.json(err);
  });
};*/
// Find a single Tutor with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Tutor.findById(id)
    .populate({path: 'coursePublished'})
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
  Tutor.find({ published: true, isValid: true })
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

//Send Email to Tutor
exports.sendEmailToTutor = async(req, res, next) => {
  try{
      const result = req.body
      const Tutoruser = await Tutor.findOne({ email: result.email})
      if(!Tutoruser) return next(createError.NotFound('Email is not registered'))

      const sendMail = (email, uniqueString) => {
          var Transport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                  user: process.env.GMAIL,
                  pass: process.env.PASSWORD
              }
          });

          var mailOptions;
          let sender = "TheMentor";
          mailOptions = {
              from: sender,
              to: result.email,
              subject: "Email confirmation",
              html: `This is your account email: ${result.email} <br> This your your account password: ${Tutoruser.password}<br> Press <a href=http://localhost:8080/api/tutorAuth/tutorVerify/${uniqueString}> here </a> to verify your email.`
          };
          
          Transport.sendMail(mailOptions, function(error, response){
              if(error) {
                  console.log(error);
              }else {
                  console.log('Message sent')
                  res.json({ message:'Check your email to verify it'})
              }
          })
      }
      sendMail(result.email,Tutoruser.uniqueString)

  }catch(error){
      if(error.isJoi === true) error.status = 422
      next(error)
  }
};

// verify tutor account
exports.tutorVerify = async(req, res, next) => {
  try {

      const result = req.body
      const Tutoruser = await Tutor.findOne({ email: result.email})
      if(!Tutoruser) return next(createError.NotFound('Email is not registered'))

      let validPassword = false
      if(result.password == Tutoruser.password)
        {
          validPassword = true
      }
      if(!validPassword) return next(createError.Unauthorized('Email/Password not valid'))

      const { uniqueString } = req.params

      const tutoruser = await Tutor.findOne({ uniqueString: uniqueString})
      if(tutoruser)
      {
          tutoruser.isValid = true
          await tutoruser.save()

          const accessToken = await signAccessToken(tutoruser.id)
          const refreshToken = await signRefreshToken(tutoruser.id)
      
          res.json({ accessToken, refreshToken });

      }else{
          res.json('User not found')
      }


  } catch (error) {
      next(error)
  }
};

// tutor Login Route
exports.tutorLogin = async(req, res, next) => {
  try{
      const result = req.body
  
      const Tutoruser = await Tutor.findOne({ email: result.email })
      if(!Tutoruser) return next(createError.NotFound('Email is not registered'))

      if(!Tutoruser.isValid) return next(createError.Unauthorized('User not found'))
      if(Tutoruser.role != tutorer)
      {
          return next(createError.Unauthorized('User not found'))
      }
    
      let validPassword = false
      if(result.password == Tutoruser.password)
      {
          validPassword = true
          
      }
      if(!validPassword) return next(createError.Unauthorized('Email/Password not valid'))
      
      const accessToken = await signAccessToken(Tutoruser.id)
      const refreshToken = await signRefreshToken(Tutoruser.id)
      
      res.send({ accessToken, refreshToken });
      
  }catch(error){
      if(error.isJoi === true)
          return next(createError.BadRequest('Invalid Password'));
  }
};

// Tutor Refresh Token Route
exports.tutorRefreshToken = async(req, res, next) => {
  try{
      const{ refreshToken } = req.body
      if(!refreshToken) next(createError.BadRequest())
      const tutorId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(tutorId)
      const refToken = await signRefreshToken(tutorId)

      res.send({ accessToken: accessToken, refreshToken: refToken })

  }catch(error){
      next(error)
  }
};

// Tutor Logout Route
exports.tutorLogout = async(req, res, next) => {
  try{
      const { refreshToken } = req.body
      if(!refreshToken) next(createError.BadRequest())
      const tutorId = await verifyRefreshToken(refreshToken)
      client.DEL(tutorId, (err, val) => {
          if(err){
              next(createError.InternalServerError())
          }
          console.log(val)
          res.send('Logout Successfully')
      })
  }catch(error)
  {
      next(error)
  }
};