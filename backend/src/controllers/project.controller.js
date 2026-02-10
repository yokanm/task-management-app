import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Tasks from '../models/tasks.model.js';
import TaskGroup from '../models/taskGroup.model.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Get task count for each project (tasks directly under project OR in its task groups)
    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        // Get all task groups for this project
        const taskGroups = await TaskGroup.find({ _id: project.taskGroup });
        const groupIds = taskGroups.map(g => g._id);

        // Count tasks with parent pointing to this project OR its task groups
        const taskCount = await Tasks.countDocuments({
          $or: [
            { 'parent.id': project._id, 'parent.type': 'Project' },
            { 'parent.id': { $in: groupIds }, 'parent.type': 'TaskGroup' }
          ]
        });

        return {
          ...project.toObject(),
          taskCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithTasks.length,
      data: projectsWithTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format',
      });
    }

    const project = await Project.findById(req.params.id).populate('taskGroup');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Get all task groups for this project
    const taskGroups = await TaskGroup.find({ _id: project.taskGroup });
    const groupIds = taskGroups.map(g => g._id);

    // Get tasks directly under project OR in its task groups
    const tasks = await Tasks.find({
      $or: [
        { 'parent.id': project._id, 'parent.type': 'Project' },
        { 'parent.id': { $in: groupIds }, 'parent.type': 'TaskGroup' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// @desc    Create new project
// @route   POST /api/v1/project
// @access  Private
const createProject = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // ✅ FIX: Auto-create taskGroup if not provided
    if (!req.body.taskGroup) {
      const defaultTaskGroup = await TaskGroup.create({
        name: req.body.name || 'Default Group',
        icon: req.body.logo || '📋',
        color: req.body.color || '#6C5DD3',
        user: req.user.id
      });
      req.body.taskGroup = defaultTaskGroup._id;
      
      console.log('Auto-created taskGroup:', defaultTaskGroup._id);
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format',
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // NEW: Safer deletion with options
    const tasksDirectlyUnderProject = await Tasks.find({
      'parent.id': project._id,
      'parent.type': 'Project'
    });

    if (tasksDirectlyUnderProject.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete project. ${tasksDirectlyUnderProject.length} task(s) are directly assigned to this project. Please reassign or delete them first.`,
      });
    }

    // Delete all tasks in associated task groups (cascade delete)
    const taskGroups = await TaskGroup.find({ _id: project.taskGroup });
    const groupIds = taskGroups.map(g => g._id);
    
    await Tasks.deleteMany({
      'parent.id': { $in: groupIds },
      'parent.type': 'TaskGroup'
    });

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getProject, getProjects, createProject, updateProject, deleteProject };