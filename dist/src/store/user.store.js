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
const getUser_1 = __importDefault(require("@/actions/user/data/getUser"));
const valtio_1 = require("valtio");
const userStore = (0, valtio_1.proxy)({
    user: {},
    setUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data) {
                this.user = data;
                return;
            }
            const { error, user } = yield (0, getUser_1.default)();
            if (error)
                return { error };
            this.user = user;
        });
    },
});
exports.default = userStore;
