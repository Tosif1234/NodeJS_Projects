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
}, { strict: false }));

const users = await User.find({}, 'name email role isVerified status');
if (users.length === 0) {
  console.log('NO_USERS: No users found in database. Register first before requesting OTP.');
} else {
  console.log(`FOUND: ${users.length} user(s) in database:`);
  users.forEach(u => {
    console.log(`  EMAIL: ${u.email} | ROLE: ${u.role} | VERIFIED: ${u.isVerified} | STATUS: ${u.status}`);
  });
}
await mongoose.disconnect();
