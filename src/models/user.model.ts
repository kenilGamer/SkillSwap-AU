import mongoose, { Model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  role: string;
  name: string;
  username: string;
  email: string;
  skills: string[];
  password: string;
  bio: string;
  country: string;
  plan: string;
  website: string;
  verified: boolean;
  image: string;
  followers: string[];
  following: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { 
      type: String, 
      unique: true, 
      trim: true, 
      lowercase: true,
      required: true,
      index: true 
    },
    email: { 
      type: String, 
      trim: true, 
      lowercase: true,
      required: true, 
      unique: true,
      index: true 
    },
    skills: { type: [String], default: [] },
    password: { 
      type: String, 
      required: function (this: IUser) { 
        // Only require password if not a Google user (customize as needed)
        // For example, if you have a 'provider' field:
        // return this.provider !== 'google';
        return false; // For now, just make it optional for all
      } 
    },
    bio: { type: String, default: '' },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user',
      set: (v: string) => v.trim() // Trim whitespace from role
    },
    country: { type: String, default: '' },
    website: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    image: { type: String, default: '' },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
  },
  { 
    timestamps: true,
    collation: { locale: 'en', strength: 2 }
  }
);

userSchema.index({ skills: 1 });

// Create case-insensitive indexes
userSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// ✅ Ensure model name is 'User' (not 'users')
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
