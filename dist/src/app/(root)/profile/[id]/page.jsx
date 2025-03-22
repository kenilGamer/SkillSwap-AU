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
exports.default = page;
const user_model_1 = __importDefault(require("@/models/user.model"));
const Profile_1 = __importDefault(require("./Profile"));
const navigation_1 = require("next/navigation");
const redirect_1 = require("next/dist/client/components/redirect");
const mongoose_1 = require("mongoose");
const formatUser_1 = __importDefault(require("@/helpers/formatUser"));
function page(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params: { id } }) {
        try {
            if (!(0, mongoose_1.isValidObjectId)(id))
                (0, navigation_1.redirect)('/');
            const user = yield user_model_1.default.findById(id).select('name username email skills bio country website image');
            if (!user)
                (0, navigation_1.redirect)('/');
            return <Profile_1.default user={(0, formatUser_1.default)(user)}/>;
        }
        catch (error) {
            if ((0, redirect_1.isRedirectError)(error))
                (0, navigation_1.redirect)('/');
            return <div className="flex h-full w-full items-center justify-center">Something went wrong</div>;
        }
    });
}
