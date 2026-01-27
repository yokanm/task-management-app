import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
