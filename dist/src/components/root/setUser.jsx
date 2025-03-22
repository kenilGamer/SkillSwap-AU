"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SetUser;
const user_store_1 = __importDefault(require("@/store/user.store"));
function SetUser({ user }) {
    user_store_1.default.user = user;
    return <div></div>;
}
