import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  subscription: {
    plan: {
      type: String,
      enum: ['Starter', 'Professional', 'Enterprise'],
      default: 'Starter',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial'],
      default: 'trial',
    },
    trialEnds: {
      type: Date,
      default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema); 