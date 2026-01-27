import mongoose, { Schema } from 'mongoose';

const taskGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String, // emoji or icon name
    },

    color: {
      type: String, // hex or theme color
      default: '#6C5DD3',
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const TaskGroup = mongoose.model('TaskGroup', taskGroupSchema);
export default TaskGroup;
