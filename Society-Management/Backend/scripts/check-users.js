import mongoose from 'mongoose';
import User from '../models/User.js';

const check = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/smart_society');
  const users = await User.find({});
  console.log('Total users in DB:', users.length);
  users.slice(0, 5).forEach(u => {
    console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Status: ${u.status}, Verified: ${u.isVerified}`);
  });
  mongoose.connection.close();
};

check();
