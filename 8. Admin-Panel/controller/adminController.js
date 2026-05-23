  const fs = require('fs');
  const path = require('path');
  const bcrypt = require('bcrypt');

  const admin = require('../model/adminSchema');
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

  const deleteUploadedImage = async (imageName) => {
    if (!imageName) return;

    try {
      const imagePath = path.join(uploadDir, path.basename(imageName));
      await fs.promises.unlink(imagePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.log(error);
      }
    }
  };

  module.exports.dashboardPage = (req, res) => {
    res.render('pages/dashboard', { activePage: 'dashboard' });
  };

  module.exports.formLayoutPage = (req, res) => {
    res.render('pages/form-layout', { activePage: 'form-layout' });
  };

  module.exports.profilePage = (req, res) => {
    res.render('pages/profile', {
      user: req.user,
      activePage: 'profile'
    });
  };

  module.exports.registerPage = (req, res) => {
    res.render('pages/register');
  };

 module.exports.userListPage = async (req, res) => {
  try {
    const users = await admin.find();

    res.render('pages/userList', {
      users, 
      activePage: 'users'
    });

  } catch (error) {
    console.log(error);
  }
};

  module.exports.addAdmin = async(req,res) =>{
      try {
          const {fullName,phoneNumber,email,password,role,plan,status,note} = req.body;

          const image = req.file ? req.file.filename : null;

          const hashedPassword = await bcrypt.hash(password, 10);

          const newAdmin = new admin({fullName,phoneNumber,email,password: hashedPassword,role,plan,status,note, Image : image});

          await newAdmin.save();

          req.flash('success', 'User added successfully.');
          res.redirect('/users');
      } catch (error) {
          console.log(error);
          req.flash('error', 'Unable to add user. Please try again.');
          res.redirect('/form-layout');
      }
  }

module.exports.registerUser = async(req,res)=>{
  try {
    const {fullName, phoneNumber, email, password} = req.body;

    const existingUser = await admin.findOne({email});

    if(existingUser){
      req.flash('error', 'Email already exists.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await admin.create({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      role: "User",
      plan: "Basic",
      status: "Active",
      note: "Registered user"
    });

    req.logIn(newUser, (error) => {
      if(error){
        console.log(error);
        req.flash('error', 'Account created, but login failed. Please login manually.');
        return res.redirect('/login');
      }

      req.flash('success', `Welcome, ${newUser.fullName}! Your account is ready.`);
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
}

module.exports.editPage = async (req, res) => {
  try {
    const user = await admin.findById(req.params.id);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }

    res.render('pages/editUser', {
      user,
      activePage: 'users'
    });

  } catch (error) {
    console.log(error);
    req.flash('error', 'Unable to open user for editing.');
    res.redirect('/users');
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, role, plan, status, note } = req.body;
    const existingUser = await admin.findById(req.params.id);

    let updateData = {
      fullName,
      phoneNumber,
      email,
      role,
      plan,
      status,
      note
    };

    if (req.file) {
      updateData.Image = req.file.filename;
    }

    await admin.findByIdAndUpdate(req.params.id, updateData);

    if (req.file && existingUser && existingUser.Image) {
      await deleteUploadedImage(existingUser.Image);
    }

    req.flash('success', 'User updated successfully.');
    res.redirect('/users');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Unable to update user. Please try again.');
    res.redirect('/users');
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, note } = req.body;
    const existingUser = await admin.findById(req.user._id);

    const updateData = {
      fullName,
      phoneNumber,
      email,
      note
    };

    if (req.file) {
      updateData.Image = req.file.filename;
    }

    await admin.findByIdAndUpdate(req.user._id, updateData);

    if (req.file && existingUser && existingUser.Image) {
      await deleteUploadedImage(existingUser.Image);
    }

    req.flash('success', 'Profile updated successfully.');
    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Unable to update profile. Please try again.');
    res.redirect('/profile');
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await admin.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      req.flash('error', 'User not found or already deleted.');
      return res.redirect('/users');
    }

    if (deletedUser.Image) {
      await deleteUploadedImage(deletedUser.Image);
    }

    req.flash('success', 'User deleted successfully.');
    res.redirect('/users');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Unable to delete user. Please try again.');
    res.redirect('/users');
  }
};
