import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from './user.model';

export interface IMentorship {
  _id: string;
  mentor: mongoose.Types.ObjectId | IUser;
  mentee: mongoose.Types.ObjectId | IUser;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const mentorshipSchema = new Schema<IMentorship>(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Mentorship: Model<IMentorship> = mongoose.models.Mentorship || mongoose.model('Mentorship', mentorshipSchema);

export default Mentorship; 