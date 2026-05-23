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
    res.render('pages/register', { error: null });
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

          console.log(newAdmin);

          res.redirect('/users');
      } catch (error) {
          console.log(error);
      }
  }

module.exports.registerUser = async(req,res)=>{
  try {
    const {fullName, phoneNumber, email, password} = req.body;

    const existingUser = await admin.findOne({email});

    if(existingUser){
      return res.render('pages/register',{
        error : "Email already exists !!"
      });
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
        return res.redirect('/login');
      }

      res.redirect('/dashboard');
    });
  } catch (error) {
    console.log(error);
    res.render('pages/register',{
      error : "Something went wrong. Please try again."
    });
  }
}

module.exports.editPage = async (req, res) => {
  try {
    const user = await admin.findById(req.params.id);

    res.render('pages/editUser', {
      user,
      activePage: 'users'
    });

  } catch (error) {
    console.log(error);
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

    res.redirect('/users');
  } catch (error) {
    console.log(error);
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

    res.redirect('/profile');
  } catch (error) {
    console.log(error);
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    await admin.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (error) {
    console.log(error);
  }
};
