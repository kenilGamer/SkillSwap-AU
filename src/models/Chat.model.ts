import mongoose, { Schema, Model, Types } from 'mongoose';

interface IChat {
  receiver: Types.ObjectId;
  sender: Types.ObjectId;
  message: string;
  isSeen: boolean;
}

const chatSchema = new Schema<IChat>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User', // ✅ Ensure this is 'User', not 'users'
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User', // ✅ Correct reference
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
