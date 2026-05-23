const express = require('express');
const adminController = require('../controller/adminController');
const admin = require('../model/adminSchema');

const path = require('path');

const route = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, 'public/uploads')
    },
    filename : (req,file,cb)=>{
        cb(null,  Date.now() + '-' + path.extname(file.originalname));
    }
})

const isAuth = (req,res,next)=>{
    if(req.cookies.userId){
        next();
    }else{
        res.redirect('/login');
    }
}

const upload = multer({storage});

route.get('/', isAuth,adminController.dashboardPage);
route.get('/dashboard',isAuth, adminController.dashboardPage);
route.get('/form-layout',isAuth, adminController.formLayoutPage);
route.post('/users/add',isAuth, upload.single('profileImage'), adminController.addAdmin);
route.get('/users',isAuth, adminController.userListPage);

route.get('/users/edit/:id',isAuth,adminController.editPage);
route.post('/users/update/:id',isAuth, upload.single('profileImage'), adminController.updateUser);
route.post('/users/delete/:id',isAuth, adminController.deleteUser);

route.get('/login',(req,res)=>{
    res.render('pages/login',{error : null});
})
route.post('/login',adminController.loginUser);

route.get('/register', adminController.registerPage);
route.post('/register', adminController.registerUser);

route.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
});

module.exports = route;
