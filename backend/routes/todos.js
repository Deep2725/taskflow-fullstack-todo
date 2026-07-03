const express = require('express');
const Todo = require('../models/Todo');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes below require a valid JWT
router.use(protect);

// @route   GET /api/todos - get all todos for logged-in user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/todos - create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const todo = await Todo.create({ user: req.userId, title, priority });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/todos/:id - update a todo (title, completed, priority)
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const { title, completed, priority } = req.body;
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/todos/:id - delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
