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
exports.default = getMyPosts;
const auth_1 = __importDefault(require("@/auth/auth"));
const Post_model_1 = __importDefault(require("@/models/Post.model"));
function getMyPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield auth_1.default.getCurrentUser();
        if (res.error)
            return { error: 'Something went wrong' };
        try {
            const posts = yield Post_model_1.default.find({ owner: res.user._id }).limit(10).populate('owner', 'username image name _id');
            return { posts: JSON.parse(JSON.stringify(posts)).reverse() };
        }
        catch (error) {
            console.log(error);
            return { error: 'Something went wrong' };
        }
    });
}
