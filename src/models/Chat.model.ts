import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IChat {
  participants: Types.ObjectId[]; // Array of user IDs
  // Optionally, you can add other fields like lastMessage, etc.
}

const chatSchema = new Schema<IChat>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    // Optionally, add lastMessage, createdAt, etc.
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
export default Chat;