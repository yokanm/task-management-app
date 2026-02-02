import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['To do', 'In Progress', 'Completed'],
      default: 'To do',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
    dueTime: {
      type: String,
    },
    // NEW: Single parent field instead of separate project/taskGroup
    parent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'parent.type'
      },
      type: {
        type: String,
        required: true,
        enum: ['Project', 'TaskGroup']
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// IMPORTANT: Add index for fast queries
taskSchema.index({ 'parent.id': 1, 'parent.type': 1 });
taskSchema.index({ user: 1, 'parent.id': 1 });

const Tasks = mongoose.model('Tasks', taskSchema);

export default Tasks;