const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/authentication');
var multer = require("multer");

const request = require('request');
//const axios = require('axios');



const Video = require('../models/user');

// Register




router.post('/register', (req, res, next) => {

    let user = new User({
      name:req.body.name,
      username:req.body.username,
      email:req.body.username,
      password:req.body.password
    })


  User.addUser(user,(err, user) => {
    console.log(err)
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
  
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 3600 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


router.post('/addVideo',(req,res,next)=>{
  //console.log(req.body)
   let video = new Video({
    name: req.body.name,
    slug: req.body.slug,
    image: req.body.image,
    embed: req.body.embed,
  });


   video.save((err,vid)=>{
    if(err){
      res.json({success:false, msg:"Video is not Successfully saved"});
    }
    else{
      //console.log(vid)
      res.json({success:true,msg:"Video is Successfully Saved"});
    }
   })

})

router.get('/videos',(req,res,next)=>{
  //console.log(req);
  //console.log(req.decoded.userId)
  Video.find(function(err,video){

      res.json(video);
    });

});

 router.delete('/videos/:id',(req,res,next)=>{

    Video.remove({_id:req.params.id},(err,result)=>{

      if(err){
        res.json({success:false,msg:"Something Went wrong"});
      }

      else{
        res.json({success:true,msg:"Video is Successfully deleted"});
      }
    });

 });


var storage = multer.diskStorage({
  // destino del fichero
  destination: function (req, file, cb) {
    cb(null, './angular-src/src/assets')
  },
  // renombrar fichero
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

 router.put('/edit/upload',upload.array("uploads[]", 12),(req,res,next)=>{
  //console.log(req.body)
  
  Video.findByIdAndUpdate(req.body.id,{name:req.body.name,
                      slug:req.body.slug,
                      image:req.files[0].filename,
                      embed:req.files[1].filename},(err,result)=>{
                        if(err){
                          res.json({success:false,msg:"Not Updated"});
                        }
                        else{
                          res.json({success:true,msg:"Successfully Updated"});
                        }
                      });
                      
});




router.post("/upload", upload.array("uploads[]", 12), function (req, res) {
  let video = new Video({
    name: req.body.name,
    slug: req.body.slug,
    image: req.files[0].filename,
    embed: req.files[1].filename,
    createdBy:req.body.createdBy,
  });
   video.save((err,vid)=>{
    if(err){
      res.json({success:false, msg:"Video is not Successfully saved"});
    }
    else{
      //console.log(vid)
      res.json({success:true,msg:"Video is Successfully Saved"});
    }
   })

});
var like;
router.post('/video/like',(req,res,next)=>{
 //console.log(req.body.username)
  Video.findOne({ _id: req.body.id },(err,result)=>{
    //console.log(result.likedBy)
    //console.log(req.body.username)
    if (result.likedBy.includes(req.body.username)) {
          res.json({ success: false, message: 'You already liked this post.' }); 
                    }

    else{
      if (result.dislikedBy.includes(req.body.username)) {
          result.dislikes--;
          const arrayIndex = result.dislikedBy.indexOf(req.body.username);
          result.dislikedBy.splice(arrayIndex, 1);

          result.likedBy.push(req.body.username);
          result.likes++;
          result.save((err)=>{
            if(err){
                res.json({success:false, msg:"Error in liked the post"});
      }
             else{
              res.json({success:true,msg:"Successfully Liked the post"});
      }
         })
    }
    else{
      result.likedBy.push(req.body.username);
          result.likes++;
              result.save((err)=>{
            if(err){
                res.json({success:false, msg:"Error in liked the post"});
      }
             else{
              res.json({success:true,msg:"Successfully Liked the post"});
      }
         })
    }
    }              


  });
    });

var dislike;
router.post('/video/dislike',(req,res,next)=>{
 //console.log(req.body.username)
  Video.findOne({ _id: req.body.id },(err,result)=>{
    if (result.dislikedBy.includes(req.body.username)) {
          res.json({ success: false, message: 'You already disliked this post.' }); 
                    }

    else{
      if (result.likedBy.includes(req.body.username)) {
          result.likes--;
          const arrayIndex = result.likedBy.indexOf(req.body.username);
          result.likedBy.splice(arrayIndex, 1);

          result.dislikedBy.push(req.body.username);
          result.dislikes++;
          result.save((err)=>{
            if(err){
                res.json({success:false, msg:"Error in disliked the post"});
      }
             else{
              res.json({success:true,msg:"Successfully disliked the post"});
      }
         })
    }
    else{
      result.dislikedBy.push(req.body.username);
          result.dislikes++;
              result.save((err)=>{
            if(err){
                res.json({success:false, msg:"Error in disliked the post"});
      }
             else{
              res.json({success:true,msg:"Successfully disliked the post"});
      }
         })
    }
    }              


  });
    });


router.post('/video/comment',(req,res,next)=>{
  console.log(req.body)
  Video.findOne({_id:req.body.id},(err,result)=>{
    if(err){
      res.json({success:false,msg:"Video is not found"});
    }
    else{
      
      console.log(result)
      
      var comm = {"commentby": req.body.email, "comment": req.body.comment};
      result.comments.push(comm);

      result.save((err,comment)=>{
        if(err){
          res.json({success:false,msg:"Something Went Wrong!!!!"});
        }
        else{
          res.json({success:true,msg:"Comment is Successfully Saved"});
        }


      })
      
    }

  })

})


router.post('/find_location',(req,res,next)=>{


  var API_KEY = "Your api_key";

  var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";

    var address = req.body.location;

    var url = BASE_URL + address + "&key=" + API_KEY;


    request.get({url:url,json:true},(error, response, body)=>{

      res.json(response);

    });

 

    });










module.exports = router;
