import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  promptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    required: [true, 'Prompt ID is required'],
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Feedback type is required'],
    enum: ['bug', 'suggestion', 'praise', 'other'],
    index: true,
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in_review', 'resolved', 'closed'],
    default: 'pending',
    index: true,
  },
  adminResponse: {
    message: {
      type: String,
      trim: true,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: {
      type: Date,
    },
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ promptId: 1, createdAt: -1 });
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

// Virtual for response time
feedbackSchema.virtual('responseTime').get(function() {
  if (this.adminResponse?.respondedAt) {
    return this.adminResponse.respondedAt.getTime() - this.createdAt.getTime();
  }
  return null;
});

// Pre-save middleware
feedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('adminResponse') && this.adminResponse) {
    this.adminResponse.respondedAt = new Date();
  }
  next();
});

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema); 