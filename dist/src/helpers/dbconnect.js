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
exports.default = dbconnect;
const mongoose_1 = __importDefault(require("mongoose"));
function dbconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (((_a = mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.readyState) === 1)
                return { success: 'MongoDB connected' };
            yield mongoose_1.default.connect(process.env.MONGODB_URI, {
                dbName: 'SkillSwap',
            });
            return { success: 'MongoDB connected' };
        }
        catch (error) {
            return { error: 'Could not connect to MongoDB' };
        }
    });
}
