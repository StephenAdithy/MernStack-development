const express = require('express');
const router = express.Router();
const Submission = require('../models/submissions');
const Assignment = require('../models/assignments');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// POST /api/submissions -> student submits answer
router.post('/', auth, requireRole('student'), async (req, res) => {
  const { assignmentId, answer } = req.body;
  if(!assignmentId || !answer) return res.status(400).json({ message: 'assignmentId and answer required' });

  const assignment = await Assignment.findById(assignmentId);
  if(!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if(assignment.status !== 'Published') return res.status(400).json({ message: 'Assignment not open for submission' });

  // prevent after due date
  if(new Date() > new Date(assignment.dueDate)) return res.status(400).json({ message: 'Assignment due date passed' });

  // prevent more than one submission per student
  const existing = await Submission.findOne({ assignmentId, studentId: req.user.id });
  if(existing) return res.status(400).json({ message: 'You have already submitted for this assignment' });

  const s = new Submission({ assignmentId, studentId: req.user.id, answer });
  await s.save();
  res.status(201).json(s);
});

// GET /api/submissions/:assignmentId -> teacher views (we already implemented in assignments route)
// GET own submission of student for an assignment
router.get('/mine/:assignmentId', auth, requireRole('student'), async (req, res) => {
  const { assignmentId } = req.params;
  const sub = await Submission.findOne({ assignmentId, studentId: req.user.id });
  if(!sub) return res.status(404).json({ message: 'No submission found' });
  res.json(sub);
});

module.exports = router;
