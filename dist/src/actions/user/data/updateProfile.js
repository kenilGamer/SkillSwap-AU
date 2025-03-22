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
exports.default = updateProfile;
const auth_1 = __importDefault(require("@/auth/auth"));
const formatUser_1 = __importDefault(require("@/helpers/formatUser"));
const user_model_1 = __importDefault(require("@/models/user.model"));
function updateProfile(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const res = yield auth_1.default.getCurrentUser();
        if (res.error)
            return { error: 'Something went wrong' };
        try {
            const user = yield user_model_1.default.findByIdAndUpdate(res.user._id, data, {
                new: true,
            });
            return { success: 'Your profile has been updated', user: (0, formatUser_1.default)(user) };
        }
        catch (error) {
            if (error.code === 11000) {
                if ((_a = error.keyValue) === null || _a === void 0 ? void 0 : _a.username)
                    return { error: 'Username already in use' };
                return { error: 'Email already in use' };
            }
            return { error: 'Something went wrong' };
        }
    });
}
