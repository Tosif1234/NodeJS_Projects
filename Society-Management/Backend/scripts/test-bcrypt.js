import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const test = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/smart_society');
  const user = await User.findOne({ email: 'admin@society.com' });
  console.log('User found:', user.email);
  console.log('User hashed password in DB:', user.password);

    const isMatch = await user.matchPassword('Password@123');
  console.log('Does matchPassword work?', isMatch);

    const rawMatch = await bcrypt.compare('Password@123', user.password);
  console.log('Does raw bcrypt.compare work?', rawMatch);

    mongoose.connection.close();
};
test();
