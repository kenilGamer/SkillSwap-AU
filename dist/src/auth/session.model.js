"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("@/models/user.model"));
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const scema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.default,
        required: true,
    },
    expiresAt: Date,
});
const Session = mongoose_1.models.Session || (0, mongoose_1.model)('Session', scema);
exports.default = Session;
