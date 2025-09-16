const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignments');
const Submission = require('../models/submissions');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// GET /api/assignments -> list (behavior differs by role)
router.get('/', auth, async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  if(req.user.role === 'teacher'){
    // teacher: list all created by them, optional status filter
    const query = { createdBy: req.user.id };
    if(status) query.status = status;
    const [items, total] = await Promise.all([
      Assignment.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Assignment.countDocuments(query)
    ]);
    return res.json({ items, total });
  } else {
    // student: show only Published assignments
    const query = { status: 'Published' };
    const [items, total] = await Promise.all([
      Assignment.find(query).sort({ dueDate: 1 }).skip(skip).limit(Number(limit)),
      Assignment.countDocuments(query)
    ]);
    return res.json({ items, total });
  }
});

// POST /api/assignments -> create (teacher only)
router.post('/', auth, requireRole('teacher'), async (req, res) => {
  const { title, description, dueDate } = req.body;
  if(!title || !dueDate) return res.status(400).json({ message: 'Title and dueDate required' });

  const a = new Assignment({ title, description, dueDate, createdBy: req.user.id });
  await a.save();
  res.status(201).json(a);
});

// PUT /api/assignments/:id -> edit (only when Draft & owner)
router.put('/:id', auth, requireRole('teacher'), async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);
  if(!assignment) return res.status(404).json({ message: 'Not found' });
  if(String(assignment.createdBy) !== req.user.id) return res.status(403).json({ message: 'Not owner' });
  if(assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft can be edited' });

  const { title, description, dueDate } = req.body;
  Object.assign(assignment, { title, description, dueDate });
  await assignment.save();
  res.json(assignment);
});

// DELETE /api/assignments/:id -> delete (only Draft & owner)
router.delete('/:id', auth, requireRole('teacher'), async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);
  if(!assignment) return res.status(404).json({ message: 'Not found' });
  if(String(assignment.createdBy) !== req.user.id) return res.status(403).json({ message: 'Not owner' });
  if(assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft can be deleted' });
  await assignment.remove();
  res.json({ message: 'Deleted' });
});

// PUT /api/assignments/:id/status -> update status (teacher only)
router.put('/:id/status', auth, requireRole('teacher'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expected: 'Published' or 'Completed'
  const assignment = await Assignment.findById(id);
  if(!assignment) return res.status(404).json({ message: 'Not found' });
  if(String(assignment.createdBy) !== req.user.id) return res.status(403).json({ message: 'Not owner' });

  // enforce valid transition
  const from = assignment.status;
  const to = status;
  const valid = (from === 'Draft' && to === 'Published') || (from === 'Published' && to === 'Completed');
  if(!valid) return res.status(400).json({ message: `Invalid status transition from ${from} to ${to}` });

  assignment.status = to;
  await assignment.save();
  res.json(assignment);
});

// GET /api/assignments/:id/submissions -> teacher view submissions
router.get('/:id/submissions', auth, requireRole('teacher'), async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);
  if(!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if(String(assignment.createdBy) !== req.user.id) return res.status(403).json({ message: 'Not owner' });

  const subs = await Submission.find({ assignmentId: id }).populate('studentId', 'name email').sort({ submittedAt: -1 });
  res.json(subs);
});

module.exports = router;
