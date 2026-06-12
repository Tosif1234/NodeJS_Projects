const express = require('express');
const adminController = require('../controller/adminController');
const passport = require('../config/passport');
const { requirePermission } = require('../middleware/roleMiddleware');

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

    req.flash('warning', 'Please login first to continue.');
    res.redirect('/login');
}

const upload = multer({storage});

route.get('/', isAuth, requirePermission('dashboard:view'), adminController.dashboardPage);
route.get('/dashboard', isAuth, requirePermission('dashboard:view'), adminController.dashboardPage);
route.get('/form-layout', isAuth, requirePermission('users:manage'), adminController.formLayoutPage);
route.get('/profile', isAuth, requirePermission('profile:manage'), adminController.profilePage);
route.post('/profile', isAuth, requirePermission('profile:manage'), upload.single('profileImage'), adminController.updateProfile);
route.get('/change-password', isAuth, requirePermission('profile:manage'), adminController.changePasswordPage);
route.post('/change-password', isAuth, requirePermission('profile:manage'), adminController.changePasswordSubmit);
route.post('/users/add', isAuth, requirePermission('users:manage'), upload.single('profileImage'), adminController.addAdmin);
route.get('/users', isAuth, requirePermission('users:manage'), adminController.userListPage);
route.get('/users/trash', isAuth, requirePermission('users:manage'), adminController.trashUsersPage);

route.get('/users/edit/:id', isAuth, requirePermission('users:manage'), adminController.editPage);
route.post('/users/update/:id', isAuth, requirePermission('users:manage'), upload.single('profileImage'), adminController.updateUser);
route.post('/users/delete/:id', isAuth, requirePermission('users:manage'), adminController.deleteUser);
route.post('/users/restore/:id', isAuth, requirePermission('users:manage'), adminController.restoreUser);
route.post('/users/permanent-delete/:id', isAuth, requirePermission('users:manage'), adminController.permanentDeleteUser);

route.get('/login',(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }

    res.render('pages/login');
})

route.get('/forgot-password', adminController.forgotPasswordPage);
route.post('/forgot-password', adminController.forgotPasswordSubmit);
route.get('/verify-otp', adminController.verifyOtpPage);
route.post('/verify-otp', adminController.verifyOtpSubmit);
route.get('/resend-otp', adminController.resendOtp);
route.get('/reset-password', adminController.resetPasswordPage);
route.post('/reset-password', adminController.resetPasswordSubmit);

route.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if(error){
            req.flash('error', 'Login failed. Please try again.');
            return next(error);
        }

        if(!user){
            req.flash('error', info && info.message ? info.message : 'Invalid email or password');
            return res.redirect('/login');
        }

        req.logIn(user, (loginError) => {
            if(loginError){
                req.flash('error', 'Login failed. Please try again.');
                return next(loginError);
            }

            req.flash('success', `Welcome back, ${user.fullName || 'Admin'}!`);
            res.redirect('/dashboard');
        });
    })(req, res, next);
});

route.get('/register', adminController.registerPage);
route.post('/register', adminController.registerUser);

route.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if(error){
        req.flash('error', 'Logout failed. Please try again.');
        return next(error);
    }

    req.flash('success', 'You have been logged out successfully.');
    res.redirect('/login');
  });
});

module.exports = route;
