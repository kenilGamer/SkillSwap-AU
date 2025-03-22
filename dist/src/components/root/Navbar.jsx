"use strict";
'use client';
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
exports.default = Navbar;
const md_1 = require("react-icons/md");
const go_1 = require("react-icons/go");
const lia_1 = require("react-icons/lia");
const io5_1 = require("react-icons/io5");
const fa_1 = require("react-icons/fa");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const navigation_1 = require("next/navigation");
const logout_1 = __importDefault(require("@/actions/user/authentication/logout"));
function Navbar() {
    const pathname = (0, navigation_1.usePathname)();
    const links = [
        { path: '/', name: 'Home', icon: <go_1.GoHome /> },
        { path: '/matchmaking', name: 'Matchmaking', icon: <lia_1.LiaHandshake /> },
        { path: '/chat', name: 'Chat', icon: <io5_1.IoChatbubbleEllipsesOutline /> },
        { path: '/profile', name: 'Profile', icon: <fa_1.FaRegUser /> },
    ];
    return (<div className="relative flex h-screen w-14 flex-shrink-0 flex-col items-center justify-between bg-accent p-2 shadow-[0px_1px_4px_#00000070]">
            <div className="relative aspect-square w-full">
                <image_1.default src="/logo.png" alt="SkillSwap" fill/>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
                {links.map((e, i) => (<link_1.default key={i} href={e.path} className={`flex aspect-square w-9 items-center justify-center rounded-md text-2xl ${pathname === e.path && 'bg-indigo-500 text-xl text-white'}`}>
                        {e.icon}
                    </link_1.default>))}
            </div>
            <md_1.MdOutlineLogout onClick={() => __awaiter(this, void 0, void 0, function* () {
            yield (0, logout_1.default)();
            window.location.href = '/login';
        })} size="30px" className="rotate-180 cursor-pointer"/>
        </div>);
}
