const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/', (req,res) => {
    res.send('Inside login pagee');
});

router.get('/register', (req,res) => {
   res.render('register');
});

router.get('/login', (req,res) => {
    res.render('login');
 });

 router.get('/dashboard', (req,res) => {
    res.render('dashboard');
 });


//Register handle
 router.post('/register', (req,res) => {
    const {name, email,password, password2} = req.body;
    
    let errors = [];
    //Check required fields
    if(!name || !email || !password || !password2)
        errors.push({msg: 'Please fill in all fields'});

    //Check passwords match
    if(password != password2)
        errors.push({msg: 'Passwords do not match'});

    if(errors.length > 0 ){
        res.render('register', {
            errors,name,email,password,password2
        });
    }
    else{
        User.findOne({email: email})
        .then( user => {
            if(user){
                console.log('user already exists');
                errors.push({msg: 'User already exists'});
                res.render('register', {
                    errors,name,email,password,password2
                });
            }
            else{
                const newUser = new User({
                    name: name,
                    email: email,
                    password
                })
                bcrypt.genSalt(10, (err,salt) => {
                    const pass = bcrypt.hash(req.body.password,salt, (err, hash) => {
                        if(err) throw err;
                        else{
                            //Push to db
                            newUser.password = hash;
                            newUser.save(newUser)
                            .then(user => {
                                console.log('successfully added a new User to ddb');
                                req.flash('success_msg','You are now registered. Please login');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        }
                    })
                })
            }
        })
        .catch();
    }
}); 

//Login handle
router.post('/login', (req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/users/dashboard',
        successMessage: 'succesful login',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Logout handle
router.get('/logout',(req,res,next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;