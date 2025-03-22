"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Chat;
const input_1 = require("@/components/shadcn/ui/input");
const react_1 = require("react");
const fa_1 = require("react-icons/fa");
const md_1 = require("react-icons/md");
const ChatCard_1 = __importDefault(require("./ChatCard"));
const ChatPanel_1 = __importDefault(require("./ChatPanel"));
const valtio_1 = require("valtio");
const chat_store_1 = __importDefault(require("@/store/chat.store"));
function Chat() {
    const [showUnsavedChats, setShowUnsavedChats] = (0, react_1.useState)(false);
    const { chats } = (0, valtio_1.useSnapshot)(chat_store_1.default);
    return (<div className="flex grow overflow-hidden">
            <div className="relative flex w-[330px] select-none flex-col py-3 shadow-[0px_0px_3px_#00000040]">
                <div className="relative mx-3">
                    <md_1.MdSearch className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-black/60"/>
                    <input_1.Input className="pl-8" placeholder="Search..."/>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-xl font-medium">{showUnsavedChats ? 'Unsaved Chats' : 'Messages'}</h1>
                    <div onClick={() => {
            setShowUnsavedChats(!showUnsavedChats);
        }} className="relative cursor-pointer">
                        <div className="absolute bottom-[60%] right-[40%] z-10 aspect-square w-2 rounded-full bg-red-500"></div>
                        <div className={`rounded-full p-[6px] ${showUnsavedChats && 'bg-gray-200'}`}>
                            <fa_1.FaRegBell size="20px" className="rotate-45"/>
                        </div>
                    </div>
                </div>
                <div className="grow overflow-hidden">
                    <div className={`flex h-full transition duration-500 ${showUnsavedChats && 'translate-x-[-100%]'}`}>
                        <div className="flex h-full w-full shrink-0 flex-col gap-3 overflow-auto">
                            {chats.map((e, i) => {
            return (<ChatCard_1.default key={i} data={e}/>);
        })}
                        </div>
                        <div className="flex w-full shrink-0 flex-col gap-3">
                            {<ChatCard_1.default data={chats[0]}/>}
                            {<ChatCard_1.default data={chats[1]}/>}
                        </div>
                    </div>
                </div>
            </div>
            <ChatPanel_1.default />
        </div>);
}
