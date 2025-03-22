"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidation = void 0;
const zod_1 = require("zod");
// Schema validation for Post model
exports.postValidation = zod_1.z.object({
    requiredSkills: zod_1.z.array(zod_1.z.string()).min(1),
    description: zod_1.z.string().min(10, 'Content must be at least 10 characters').max(1024, 'Content must be at most 1024 characters'),
    owner: zod_1.z.string().optional(),
});
