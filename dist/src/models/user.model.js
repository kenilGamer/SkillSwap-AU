"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    website: {
        type: String,
        default: '',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: '',
    },
}, { timestamps: true });
const User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.default = User;
