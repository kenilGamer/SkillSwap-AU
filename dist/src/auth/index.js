"use strict";
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
const mongoose_1 = require("mongoose");
const headers_1 = require("next/headers");
const uuid_1 = require("uuid");
const session_model_1 = __importDefault(require("./session.model"));
class Auth {
    constructor(options) {
        this.dbconnect = options.dbconnect;
        this.session_cookie_name = options.session_cookie_name || 'session_id';
    }
    createSession(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, expiresIn }) {
            if (!(0, mongoose_1.isValidObjectId)(userId))
                return { error: 'Invalid user ID' };
            try {
                yield this.dbconnect();
                const session = yield session_model_1.default.create({ user: userId, expiresAt: Date.now() + expiresIn });
                (0, headers_1.cookies)().set(this.session_cookie_name, session._id, {
                    httpOnly: true,
                    expires: Date.now() + expiresIn,
                    secure: process.env.NODE_ENV === 'production',
                });
                return { success: 'Session created successfully', data: session };
            }
            catch (error) {
                return { error: "Couldn't create Session" };
            }
        });
    }
    getCurrentSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getCurrentUser({ withSession: true });
        });
    }
    getCurrentUser() {
        return __awaiter(this, arguments, void 0, function* (option = undefined) {
            const session_id = (0, headers_1.cookies)().get(this.session_cookie_name);
            if (!session_id || !(0, uuid_1.validate)(session_id.value))
                return { error: 'Invalid Session ID' };
            try {
                yield this.dbconnect();
                const session = yield session_model_1.default.findById(session_id.value, { __v: false }).populate('user', {
                    __v: false,
                });
                if (!session)
                    return { error: 'Session not found' };
                if (session.expiresAt <= new Date() || !session.user) {
                    yield session.deleteOne();
                    return { error: 'Session has expired' };
                }
                return JSON.parse(JSON.stringify((option === null || option === void 0 ? void 0 : option.withSession) ? { session } : { user: session.user }));
            }
            catch (error) {
                return { error: "Couldn't get Session" };
            }
        });
    }
    deleteCurrentUsersSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const session_id = (0, headers_1.cookies)().get(this.session_cookie_name);
            if (!session_id || !(0, uuid_1.validate)(session_id.value))
                return { error: 'Invalid Session ID' };
            try {
                yield this.dbconnect();
                yield session_model_1.default.deleteOne({ _id: session_id.value });
                return { success: 'Deleted current users session' };
            }
            catch (error) {
                return { error: "Couldn't delete current users session" };
            }
        });
    }
    deleteCurrentUsersAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.getCurrentUser();
                if (res.error)
                    return { error: res.error };
                yield session_model_1.default.deleteMany({ user: res.user._id });
                return { success: 'Deleted current users all session' };
            }
            catch (error) {
                return { error: "Couldn't delete current users session" };
            }
        });
    }
    deleteSession(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filter._id && !filter.user) {
                return { error: 'Session ID or User ID, at least one is required' };
            }
            try {
                yield this.dbconnect();
                const deletedSessions = yield session_model_1.default.deleteMany(filter);
                if (!deletedSessions.deletedCount)
                    return { success: 'Session was not found with provied Session/User ID' };
                return { success: filter.user ? 'Deleted sessions by user id' : 'Deleted session by session id' };
            }
            catch (error) {
                return { error: "Couldn't delete session" };
            }
        });
    }
    deleteExpiredSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbconnect();
                yield session_model_1.default.deleteMany({ expiresAt: { $lte: new Date() } });
                return { success: 'Deleted all expired sessions' };
            }
            catch (error) {
                return { error: "Couldn't delete expired sessions" };
            }
        });
    }
    deleteAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbconnect();
                yield session_model_1.default.deleteMany({});
                return { success: 'Deleted all sessions' };
            }
            catch (error) {
                return { error: "Couldn't delete expired sessions" };
            }
        });
    }
}
exports.default = Auth;
