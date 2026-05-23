const express = require('express');
const path = require('path');

const app = express();

const connectDB = require('./config/db');
const adminRoute = require('./routes/adminRoute');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const Port = 8081;

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

app.use(passport.initialize());
app.use(passport.session());

app.use('/', adminRoute);

app.listen(Port , (req,res)=>{
    console.log(`Server Running on http://localhost:${Port}`);
})
