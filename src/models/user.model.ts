import mongoose, { Model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  skills: string[];
  password: string;
  bio: string;
  country: string;
  website: string;
  verified: boolean;
  image: string;
  followers: string[];
  following: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, trim: true, lowercase: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    skills: { type: [String], default: [] },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    country: { type: String, default: '' },
    website: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    image: { type: String, default: '' },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
  },
  { timestamps: true }
);

// ✅ Ensure model name is 'User' (not 'users')
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
