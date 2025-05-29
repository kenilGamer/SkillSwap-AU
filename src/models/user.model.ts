import mongoose, { Model, Schema, Document } from 'mongoose';

// Define user roles as a const enum for better typex safety
export const UserRole = {
  USER: 'user',
  Mentor : 'mentor',
  ADMIN: 'admin',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Extend Document to include Mongoose document properties
export interface IUser extends Document {
  _id: string;
  role: UserRoleType;
  name: string;
  username: string;
  email: string;
  skills: string[];
  password?: string; // Make password optional since it's not always required
  bio: string;
  country: string;
  plan?: string; // Make plan optional since it's not defined in schema
  website: string;
  verified: boolean;
  image: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define schema options separately for better readability
const schemaOptions = {
  timestamps: true,
  collation: { locale: 'en', strength: 2 },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    username: { 
      type: String, 
      required: [true, 'Username is required'],
      trim: true, 
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      trim: true, 
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    skills: { 
      type: [String], 
      default: [],
      validate: {
        validator: (skills: string[]) => skills.length <= 10,
        message: 'Cannot have more than 10 skills'
      }
    },
    password: { 
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't include password in queries by default
    },
    bio: { 
      type: String, 
      default: '',
      maxlength: [500, 'Bio cannot be longer than 500 characters']
    },
    role: { 
      type: String, 
      enum: Object.values(UserRole),
      default: UserRole.USER,
      set: (v: string) => v.trim()
    },
    country: { 
      type: String, 
      default: '',
      trim: true
    },
    website: { 
      type: String, 
      default: '',
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    verified: { 
      type: Boolean, 
      default: false 
    },
    image: { 
      type: String, 
      default: '',
      match: [/^https?:\/\/.+/, 'Please enter a valid image URL']
    },
    followers: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      default: []
    }],
    following: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      default: []
    }]
  },
  schemaOptions
);

// Add indexes
userSchema.index({ skills: 1 });
userSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// Add virtual for follower count
// eslint-disable-next-line no-unused-vars
userSchema.virtual('followerCount').get(function(this: any) {
    if (!this || typeof this !== 'object') return 0;
    const followers = this.followers;
    return Array.isArray(followers) ? followers.length : 0;
});

// Add virtual for following count
// eslint-disable-next-line no-unused-vars
userSchema.virtual('followingCount').get(function(this: any) {
    if (!this || typeof this !== 'object') return 0;
    const following = this.following;
    return Array.isArray(following) ? following.length : 0;
});

// Prevent duplicate model registration
const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', userSchema);

export default User;
