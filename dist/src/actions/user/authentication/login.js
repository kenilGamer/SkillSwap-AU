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
exports.default = Login;
const auth_1 = __importDefault(require("@/auth/auth"));
const dbconnect_1 = __importDefault(require("@/helpers/dbconnect"));
const user_model_1 = __importDefault(require("@/models/user.model"));
const user_validation_1 = require("@/validations/user.validation");
const argon2_1 = __importDefault(require("argon2"));
function Login(values) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, dbconnect_1.default)();
        if (db.error)
            return { error: 'Something went wrong' };
        const validate = user_validation_1.userLoginValidation.safeParse(values);
        if (!validate.success)
            return { error: 'Invalid request' };
        try {
            const user = yield user_model_1.default.findOne({ email: validate.data.email });
            if (!user)
                return { error: 'Incorrect email or password' };
            const doesPassMatch = yield argon2_1.default.verify(user.password, validate.data.password);
            if (!doesPassMatch)
                return { error: 'Incorrect email or password' };
            const res = yield auth_1.default.createSession({ userId: user._id.toString(), expiresIn: 1000 * 60 * 60 * 24 * 30 });
            if (res.error)
                return { error: res.error };
            return { success: 'Successfully logged in' };
        }
        catch (error) {
            return { error: 'Something went wrong' };
        }
    });
}
