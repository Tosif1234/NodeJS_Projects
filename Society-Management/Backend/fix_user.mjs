import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  isVerified: Boolean,
  status: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { strict: false }));

// Force verify and approve tosifkureshi91@gmail.com
const result = await User.updateOne(
  { email: 'tosifkureshi91@gmail.com' },
  { $set: { isVerified: true, status: 'Approved', emailVerificationToken: null, emailVerificationExpires: null } }
);

if (result.modifiedCount > 0) {
  console.log('SUCCESS: tosifkureshi91@gmail.com is now verified and approved!');
} else {
  console.log('NOT_FOUND: User tosifkureshi91@gmail.com not found.');
}

// Also check if there was a recent OTP request
const user = await User.findOne({ email: 'tosifkureshi91@gmail.com' });
if (user) {
  console.log('User status:', {
    email: user.email,
    isVerified: user.isVerified,
    status: user.status,
    hasResetToken: !!user.passwordResetToken,
    resetExpires: user.passwordResetExpires,
  });
}

await mongoose.disconnect();
