const express = require('express');
const mongoose =require('mongoose');
const path = require('path');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();

//Passport config
require('./config/passport')(passport);

// //Middddleware views
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Express session and flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Connection to the db
mongoose.connect('mongodb+srv://admin:admin@cluster0-1gy8f.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true, useNewUrlParser: true}, () =>{
    console.log('connection successful to db');
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));






app.listen(3000, () => console.log('listening to port 3000'));