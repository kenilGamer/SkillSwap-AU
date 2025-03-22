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
exports.default = layout;
const auth_1 = __importDefault(require("@/auth/auth"));
const Navbar_1 = __importDefault(require("@/components/root/Navbar"));
const navigation_1 = require("next/navigation");
const setUser_1 = __importDefault(require("@/components/root/setUser"));
const formatUser_1 = __importDefault(require("@/helpers/formatUser"));
function layout(_a) {
    return __awaiter(this, arguments, void 0, function* ({ children }) {
        const res = yield auth_1.default.getCurrentUser();
        if (res.error)
            (0, navigation_1.redirect)('/login');
        return (<div className="flex h-screen w-screen">
            <Navbar_1.default />
            <setUser_1.default user={(0, formatUser_1.default)(res.user)}/>
            {children}
            
        </div>);
    });
}
