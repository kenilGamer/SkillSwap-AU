import mongoose, { Model, Schema } from 'mongoose'
import User, { IUser } from './user.model'

// Type Definition for Post Document
export interface IPost {
    _id: string
    requiredSkills: string[]
    owner: mongoose.Types.ObjectId | IUser
    description: string
    githubLink?: string //Optional Field
    star: number
    createdAt: Date
    updatedAt: Date
    category: string
}

// Schema Definition of Post
const postSchema: Schema = new Schema<IPost>(
    {
        requiredSkills: {
            type: [String],
            required: true,
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: User,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        githubLink: {
            type: String,
            default: '',
        },
        category: {
          type: String,
          required: true,  
        },
        star: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

const Post: Model<IPost> = mongoose.models.Post || mongoose.model('Post', postSchema)

export interface IResource {
    _id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
    owner: mongoose.Types.ObjectId | IUser;
    createdAt: Date;
}

const resourceSchema: Schema<IResource> = new Schema<IResource>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: User,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Resource: Model<IResource> = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

export default Post
