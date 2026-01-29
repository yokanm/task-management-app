import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: '',
    },
    
    // Password reset
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    
    // Refresh token
    refreshToken: {
        type: String
    },
    
    // User preferences
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: {
            type: String,
            default: 'en'
        },
       
        dateFormat: {
            type: String,
            enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
            default: 'MM/DD/YYYY'
        },
        timeFormat: {
            type: String,
            enum: ['12h', '24h'],
            default: '12h'
        },
        weekStartsOn: {
            type: String,
            enum: ['Sunday', 'Monday'],
            default: 'Sunday'
        }
    },
    
    // Profile info
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    location: {
        type: String,
        maxlength: 100,
        default: ''
    },
    website: {
        type: String,
        maxlength: 200,
        default: ''
    },
    
    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
  },
  {
    timestamps: true,
  }
);
const Users = mongoose.model('User', userSchema);

export default Users;
