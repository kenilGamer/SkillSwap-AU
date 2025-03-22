"use strict";
'use server';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logout;
const auth_1 = __importDefault(require("@/auth/auth"));
const headers_1 = require("next/headers");
function Logout() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, headers_1.cookies)().delete('session_id');
            yield auth_1.default.deleteCurrentUsersSession();
            return { success: 'Successfully logged out' };
        }
        catch (error) {
            return { error: 'Something went wrong' };
        }
    });
}
