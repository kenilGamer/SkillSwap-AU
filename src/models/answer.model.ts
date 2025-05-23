import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  questionId: number;
  userName: string;
  text: string;
  userAvatarUrl?: string;
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Number, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  userAvatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema); 