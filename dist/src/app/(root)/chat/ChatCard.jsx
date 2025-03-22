"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatCard;
const dropdown_menu_1 = require("@/components/shadcn/ui/dropdown-menu");
const chat_store_1 = __importDefault(require("@/store/chat.store"));
const user_store_1 = __importDefault(require("@/store/user.store"));
const bs_1 = require("react-icons/bs");
const md_1 = require("react-icons/md");
const valtio_1 = require("valtio");
function ChatCard({ data }) {
    const { user } = (0, valtio_1.useSnapshot)(user_store_1.default);
    return (<div onClick={() => chat_store_1.default.setOpenedChat(data.id)} className="mx-3 flex h-16 cursor-pointer items-center gap-2 rounded-lg border bg-accent p-2 shadow-sm">
            <div className="aspect-square h-full shrink-0 overflow-hidden rounded-full">
                <img className="block h-full w-full object-cover" src="https://img.freepik.com/premium-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg" alt=""/>
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
                <h1 className="text-sm font-medium text-black/70">{data.users[0] == user.username ? data.users[1] : data.users[0]}</h1>
                <span className="block truncate text-xs font-medium text-black/50">{data.conversation[data.conversation.length - 1].message}</span>
            </div>
            <dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild className="ml-auto p-1">
                    <div className="text-black/60">
                        <bs_1.BsThreeDotsVertical />
                    </div>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent>
                    <dropdown_menu_1.DropdownMenuItem>
                        Delete
                        <dropdown_menu_1.DropdownMenuShortcut>
                            <md_1.MdDelete className="size-4"/>
                        </dropdown_menu_1.DropdownMenuShortcut>
                    </dropdown_menu_1.DropdownMenuItem>
                    <dropdown_menu_1.DropdownMenuItem className="text-red-400 hover:!text-red-500">
                        Report
                        <dropdown_menu_1.DropdownMenuShortcut>
                            <md_1.MdOutlineReport className="size-4"/>
                        </dropdown_menu_1.DropdownMenuShortcut>
                    </dropdown_menu_1.DropdownMenuItem>
                </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>
        </div>);
}
