const express = require('express');
const adminController = require('../controller/adminController');
const passport = require('../config/passport');

const path = require('path');

const route = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, 'public/uploads')
    },
    filename : (req,file,cb)=>{
        cb(null,  Date.now() + path.extname(file.originalname));
    }
})

const isAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.currentUser = req.user;
        return next();
    }

    res.redirect('/login');
}

const upload = multer({storage});

route.get('/', isAuth,adminController.dashboardPage);
route.get('/dashboard',isAuth, adminController.dashboardPage);
route.get('/form-layout',isAuth, adminController.formLayoutPage);
route.get('/profile',isAuth, adminController.profilePage);
route.post('/profile',isAuth, upload.single('profileImage'), adminController.updateProfile);
route.post('/users/add',isAuth, upload.single('profileImage'), adminController.addAdmin);
route.get('/users',isAuth, adminController.userListPage);

route.get('/users/edit/:id',isAuth,adminController.editPage);
route.post('/users/update/:id',isAuth, upload.single('profileImage'), adminController.updateUser);
route.post('/users/delete/:id',isAuth, adminController.deleteUser);

route.get('/login',(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }

    res.render('pages/login',{error : null});
})
route.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if(error){
            return next(error);
        }

        if(!user){
            return res.render('pages/login', {
                error: info && info.message ? info.message : 'Invalid email or password'
            });
        }

        req.logIn(user, (loginError) => {
            if(loginError){
                return next(loginError);
            }

            res.redirect('/dashboard');
        });
    })(req, res, next);
});

route.get('/register', adminController.registerPage);
route.post('/register', adminController.registerUser);

route.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if(error){
        return next(error);
    }

    res.redirect('/login');
  });
});

module.exports = route;
