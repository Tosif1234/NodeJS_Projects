const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
 
const connectDB = require('./config/db');
const adminRoute = require('./routes/adminRoute');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('./config/passport');
const Port = process.env.PORT || 8081;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: 'admin-panel-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.flashMessages = {
        success: req.flash('success'),
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info')
    };
    next();  
});

app.use('/', adminRoute);

app.listen(Port , (req,res)=>{
    console.log(`Server Running on http://localhost:${Port}`);
})
