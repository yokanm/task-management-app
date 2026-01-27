import mongoose from 'mongoose';
import Tasks from '../models/tasks.model.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ user: req.user.id })
      .populate('project', 'name logo')
      .populate('taskGroup', 'name icon color')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get today's tasks
// @route   GET /api/tasks/today
// @access  Private
const getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Tasks.find({
      user: req.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
    })
      .populate('project', 'name logo')
      .populate('taskGroup', 'name icon color')
      .sort({ dueTime: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = async (req, res) => {
  try {
    const tasks = await Tasks.find({
      user: req.user.id,
      status: req.params.status,
    })
      .populate('project', 'name logo')
      .populate('taskGroup', 'name icon color')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Tasks.countDocuments({ user: req.user.id });
    const completedTasks = await Tasks.countDocuments({
      user: req.user.id,
      isCompleted: true,
    });
    const inProgressTasks = await Tasks.countDocuments({
      user: req.user.id,
      status: 'In Progress',
    });
    const todoTasks = await Tasks.countDocuments({
      user: req.user.id,
      status: 'To do',
    });

    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
        completionPercentage,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    // ✅ ADD THIS: Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Tasks.findById(req.params.id)
      .populate('project', 'name logo description')
      .populate('taskGroup', 'name icon color');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const task = await Tasks.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private

const updateTask = async (req, res) => {
  try {
    let task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Auto-update completedAt and isCompleted
    if (req.body.status === 'Completed' && !task.isCompleted) {
      req.body.isCompleted = true;
      req.body.completedAt = new Date();
    } else if (req.body.status !== 'Completed' && task.isCompleted) {
      req.body.isCompleted = false;
      req.body.completedAt = null;
    }

    const updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  getTasks,
  createTask,
  getTodayTasks,
  getTaskStats,
  getTasksByStatus,
  getTaskById,
  updateTask,
  deleteTask,
};
