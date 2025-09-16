require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   // ✅ Import CORS
const app = express();

const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');

// ✅ Middleware
app.use(express.json());

// ✅ Enable CORS (allow frontend at localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// connect db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err=> console.error(err));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on', PORT));

