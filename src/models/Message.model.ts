import mongoose, { Schema, Document, models } from 'mongoose';

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default models.Message || mongoose.model<IMessage>('Message', MessageSchema);
