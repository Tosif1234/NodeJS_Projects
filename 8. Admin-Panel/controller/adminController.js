  const fs = require('fs');
  const path = require('path');
  const bcrypt = require('bcrypt');
  const crypto = require('crypto');
  const nodemailer = require('nodemailer');

  const admin = require('../model/adminSchema');
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  const OTP_EXPIRES_IN_MS = 2 * 60 * 1000;

  const createOtp = () => crypto.randomInt(100000, 999999).toString();

  const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

  const sendPasswordResetOtp = async (email, otp) => {
    const gmailUser = (process.env.GMAIL_USER || '').trim();
    const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');

    if (!gmailUser || !gmailAppPassword) {
      throw new Error('Missing Gmail SMTP credentials.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    });

    await transporter.sendMail({
      from: `"Materio Admin" <${gmailUser}>`,
      to: email,
      subject: 'Your password reset OTP',
      html: `
        <p>Hello,</p>
        <p>Your password reset OTP is:</p>
        <h2 style="letter-spacing: 4px;">${otp}</h2>
        <p>This OTP will expire in 2 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
  };

  const setPasswordResetSession = (req, user, otp) => {
    req.session.passwordReset = {
      userId: user._id.toString(),
      email: user.email,
      otpHash: hashOtp(otp),
      expiresAt: Date.now() + OTP_EXPIRES_IN_MS,
      verified: false
    };
  };

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

  module.exports.changePasswordPage = (req, res) => {
    res.render('pages/changePassword', {
      activePage: 'change-password'
    });
  };

  module.exports.registerPage = (req, res) => {
    res.render('pages/register');
  };

  module.exports.forgotPasswordPage = (req, res) => {
    res.render('pages/forgotPassword');
  };

  module.exports.forgotPasswordSubmit = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        req.flash('error', 'Please enter your email address.');
        return res.redirect('/forgot-password');
      }

      const user = await admin.findOne({ email });

      if (!user) {
        req.flash('error', 'No account found with this email address.');
        return res.redirect('/forgot-password');
      }

      const otp = createOtp();
      await sendPasswordResetOtp(user.email, otp);
      setPasswordResetSession(req, user, otp);

      req.flash('success', 'OTP sent to your email address.');
      res.redirect('/verify-otp');
    } catch (error) {
      console.log(error);
      req.flash('error', 'Unable to send OTP. Please check mail settings and try again.');
      res.redirect('/forgot-password');
    }
  };

  module.exports.verifyOtpPage = (req, res) => {
    const resetData = req.session.passwordReset;

    if (!resetData) {
      req.flash('error', 'Please enter your email first.');
      return res.redirect('/forgot-password');
    }

    res.render('pages/verifyOtp', {
      email: resetData.email,
      expiresAt: resetData.expiresAt
    });
  };

  module.exports.verifyOtpSubmit = (req, res) => {
    const resetData = req.session.passwordReset;
    const { otp } = req.body;

    if (!resetData) {
      req.flash('error', 'Please enter your email first.');
      return res.redirect('/forgot-password');
    }

    if (Date.now() > resetData.expiresAt) {
      req.flash('error', 'OTP expired. Please resend OTP.');
      return res.redirect('/verify-otp');
    }

    if (!otp || hashOtp(otp) !== resetData.otpHash) {
      req.flash('error', 'Invalid OTP. Please try again.');
      return res.redirect('/verify-otp');
    }

    req.session.passwordReset.verified = true;
    req.flash('success', 'OTP verified. Please set a new password.');
    res.redirect('/reset-password');
  };

  module.exports.resendOtp = async (req, res) => {
    try {
      const resetData = req.session.passwordReset;

      if (!resetData) {
        req.flash('error', 'Please enter your email first.');
        return res.redirect('/forgot-password');
      }

      const user = await admin.findById(resetData.userId);

      if (!user) {
        req.flash('error', 'Account not found.');
        return res.redirect('/forgot-password');
      }

      const otp = createOtp();
      await sendPasswordResetOtp(user.email, otp);
      setPasswordResetSession(req, user, otp);

      req.flash('success', 'A new OTP has been sent.');
      res.redirect('/verify-otp');
    } catch (error) {
      console.log(error);
      req.flash('error', 'Unable to resend OTP. Please try again.');
      res.redirect('/verify-otp');
    }
  };

  module.exports.resetPasswordPage = (req, res) => {
    const resetData = req.session.passwordReset;

    if (!resetData || !resetData.verified) {
      req.flash('error', 'Please verify OTP first.');
      return res.redirect('/forgot-password');
    }

    res.render('pages/resetPassword');
  };

  module.exports.resetPasswordSubmit = async (req, res) => {
    try {
      const resetData = req.session.passwordReset;
      const { password, confirmPassword } = req.body;

      if (!resetData || !resetData.verified) {
        req.flash('error', 'Please verify OTP first.');
        return res.redirect('/forgot-password');
      }

      if (!password || password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters.');
        return res.redirect('/reset-password');
      }

      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/reset-password');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await admin.findByIdAndUpdate(resetData.userId, { password: hashedPassword });
      delete req.session.passwordReset;

      req.flash('success', 'Password reset successfully. Please login.');
      res.redirect('/login');
    } catch (error) {
      console.log(error);
      req.flash('error', 'Unable to reset password. Please try again.');
      res.redirect('/reset-password');
    }
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

    await admin.create({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      role: "User",
      plan: "Basic",
      status: "Active",
      note: "Registered user"
    });

    req.flash(
      'success',
      'Registration successful! Please login to continue.'
    );

    res.redirect('/login');

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

module.exports.changePasswordSubmit = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await admin.findById(req.user._id);

    if (!user) {
      req.flash('error', 'Account not found.');
      return res.redirect('/change-password');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword || '', user.password);

    if (!isCurrentPasswordValid) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/change-password');
    }

    if (!newPassword || newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/change-password');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      req.flash('error', 'New password cannot be the same as your current password.');
      return res.redirect('/change-password');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New password and confirm password do not match.');
      return res.redirect('/change-password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    req.flash('success', 'Password changed successfully.');
    res.redirect('/change-password');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Unable to change password. Please try again.');
    res.redirect('/change-password');
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
