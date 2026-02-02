import TaskGroup from '../models/taskGroup.model.js';
import Tasks from '../models/tasks.model.js';
import Project from '../models/project.model.js';

// @desc    Get all task groups
// @route   GET /api/taskgroups
// @access  Private
const getTaskGroups = async (req, res) => {
  try {
    const taskGroups = await TaskGroup.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Calculate task count and completion percentage for each group
    const taskGroupsWithStats = await Promise.all(
      taskGroups.map(async (group) => {
        // NEW: Query using parent field
        const totalTasks = await Tasks.countDocuments({
          'parent.id': group._id,
          'parent.type': 'TaskGroup'
        });
        
        const completedTasks = await Tasks.countDocuments({
          'parent.id': group._id,
          'parent.type': 'TaskGroup',
          isCompleted: true,
        });

        const completionPercentage =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...group.toObject(),
          taskCount: totalTasks,
          completionPercentage,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: taskGroupsWithStats.length,
      data: taskGroupsWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single task group
// @route   GET /api/taskgroups/:id
// @access  Private
const getTaskGroup = async (req, res) => {
  try {
    const taskGroup = await TaskGroup.findById(req.params.id);

    if (!taskGroup) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    if (taskGroup.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // NEW: Get tasks using parent field
    const tasks = await Tasks.find({
      'parent.id': taskGroup._id,
      'parent.type': 'TaskGroup'
    });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...taskGroup.toObject(),
        tasks,
        taskCount: totalTasks,
        completionPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new task group
// @route   POST /api/taskgroups
// @access  Private
const createTaskGroup = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const taskGroup = await TaskGroup.create(req.body);

    res.status(201).json({
      success: true,
      data: taskGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task group
// @route   PUT /api/taskgroups/:id
// @access  Private
const updateTaskGroup = async (req, res) => {
  try {
    let taskGroup = await TaskGroup.findById(req.params.id);

    if (!taskGroup) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    if (taskGroup.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    taskGroup = await TaskGroup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: taskGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete task group
// @route   DELETE /api/taskgroups/:id
// @access  Private
const deleteTaskGroup = async (req, res) => {
  try {
    const taskGroup = await TaskGroup.findById(req.params.id);

    if (!taskGroup) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    if (taskGroup.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if any projects are using this task group
    const projectCount = await Project.countDocuments({
      taskGroup: taskGroup._id,
    });
    
    if (projectCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete task group. ${projectCount} project(s) are using this group.`,
      });
    }

    // NEW: Check tasks using parent field
    const taskCount = await Tasks.countDocuments({
      'parent.id': taskGroup._id,
      'parent.type': 'TaskGroup'
    });
    
    if (taskCount > 0) {
      // OPTION 1: Prevent deletion
      return res.status(400).json({
        success: false,
        message: `Cannot delete task group. ${taskCount} task(s) belong to this group. Please reassign or delete them first.`,
      });

      // OPTION 2: Move tasks to a default group or project (uncomment if preferred)
      /*
      // Find the first project using this task group
      const project = await Project.findOne({ taskGroup: taskGroup._id });
      
      if (project) {
        // Move all tasks to the parent project
        await Tasks.updateMany(
          { 'parent.id': taskGroup._id, 'parent.type': 'TaskGroup' },
          { parent: { id: project._id, type: 'Project' } }
        );
      }
      */

      // OPTION 3: Cascade delete (uncomment if preferred)
      /*
      await Tasks.deleteMany({
        'parent.id': taskGroup._id,
        'parent.type': 'TaskGroup'
      });
      */
    }

    await taskGroup.deleteOne();

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

export {
  getTaskGroups,
  getTaskGroup,
  createTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
};