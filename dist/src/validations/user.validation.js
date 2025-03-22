"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.userLoginValidation = exports.userSignupValidation = void 0;
const zod_1 = require("zod");
exports.userSignupValidation = zod_1.z.object({
    name: zod_1.z.string().min(4, 'Name must be at least 4 characters').max(64, 'Name must be at most 20 characters'),
    username: zod_1.z.string().trim().toLowerCase().min(4, 'Username must be at least 4 characters').max(20, 'Username must be at most 20 characters'),
    email: zod_1.z.string().email().trim(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').trim(),
});
exports.userLoginValidation = zod_1.z.object({
    email: zod_1.z.string().email().trim(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').trim(),
});
exports.userValidation = zod_1.z.object({
    name: zod_1.z.string().min(4, 'Name must be at least 4 characters').max(64, 'Name must be at most 20 characters'),
    username: zod_1.z.string().trim().toLowerCase().min(4, 'Username must be at least 4 characters').max(20, 'Username must be at most 20 characters'),
    country: zod_1.z.string(),
    website: zod_1.z.string(),
    skills: zod_1.z.array(zod_1.z.string()),
    bio: zod_1.z.string().trim(),
});
