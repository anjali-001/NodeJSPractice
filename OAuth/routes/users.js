var express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate')
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());
var passport = require('passport');

// router.get('/facebook/token', passport.authenticate('facebook-token'), (res,req) => {
//   if(req.user){
//     var token = authenticate.getToken({_id: req.user._id});
//     res.statusCode=200;
//     res.setHeader('Content-Type','application/json');
//     res.json({success:true, status: 'You are successfully logged in!',token:token});
//   }
// });

router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
  if(req.user)
  {
    var token = authenticate.getToken({_id:req.user._id}) ;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success:true ,status: 'Successfully Logged IN!',token:token});
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next)=>{
  User.register(new User({username:req.body.username}),
  req.body.password,(err,user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if (err) {
        res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
      }

      passport.authenticate('local')(req,res, ()=>{
        res.statusCode= 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true, status: 'Registration Successful!'});
      });
    }
  }); 
});

router.post('/login',passport.authenticate('local'), (req,res) => {
  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true, status: 'You are successfully logged in!',token:token});
})


router.get('/logout', (req,res) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
