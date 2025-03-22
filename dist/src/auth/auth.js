"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("@/auth"));
const dbconnect_1 = __importDefault(require("@/helpers/dbconnect"));
const auth = new auth_1.default({
    dbconnect: dbconnect_1.default,
});
exports.default = auth;
