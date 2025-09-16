require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.create([
    { name: 'Demo Teacher', email: 'teacher@example.com', password: 'password123', role: 'teacher' },
    { name: 'Demo Student', email: 'student@example.com', password: 'password123', role: 'student' }
  ]);
  console.log('seed done');
  process.exit();
}
run();
