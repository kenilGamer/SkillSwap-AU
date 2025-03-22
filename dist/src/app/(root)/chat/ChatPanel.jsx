"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatPanel;
const bs_1 = require("react-icons/bs");
const md_1 = require("react-icons/md");
const md_2 = require("react-icons/md");
const bs_2 = require("react-icons/bs");
const im_1 = require("react-icons/im");
const react_1 = require("react");
const valtio_1 = require("valtio");
const user_store_1 = __importDefault(require("@/store/user.store"));
const chat_store_1 = __importDefault(require("@/store/chat.store"));
const input_1 = require("@/components/shadcn/ui/input");
const Button_1 = require("@/components/Button");
const ChatBubble_1 = __importDefault(require("./ChatBubble"));
const dropdown_menu_1 = require("@/components/shadcn/ui/dropdown-menu");
function ChatPanel() {
    const { user } = (0, valtio_1.useSnapshot)(user_store_1.default);
    const { openedChat } = (0, valtio_1.useSnapshot)(chat_store_1.default);
    const chatBox = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        if (!openedChat)
            return;
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }, [openedChat]);
    if (!openedChat)
        return <div className="flex h-full w-full items-center justify-center text-black/60">No chat is selected</div>;
    return (<div className="flex grow flex-col overflow-hidden bg-accent">
            <div className="flex h-16 items-center justify-between bg-white px-6 shadow-[0px_0px_3px_#00000040]">
                <div className="flex h-full gap-2 rounded-lg py-2 pl-1">
                    <div className="aspect-square h-full overflow-hidden rounded-full">
                        <img className="block h-full w-full object-cover" src="https://img.freepik.com/premium-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg" alt=""/>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-medium text-gray-800">{openedChat.users[0] == user.username ? openedChat.users[1] : openedChat.users[0]}</h1>
                        <span className="block text-sm">Online</span>
                    </div>
                </div>
                <dropdown_menu_1.DropdownMenu>
                    <dropdown_menu_1.DropdownMenuTrigger asChild className="ml-auto p-1">
                        <div className="cursor-pointer text-black/60">
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
                                <md_2.MdOutlineReport className="size-4"/>
                            </dropdown_menu_1.DropdownMenuShortcut>
                        </dropdown_menu_1.DropdownMenuItem>
                    </dropdown_menu_1.DropdownMenuContent>
                </dropdown_menu_1.DropdownMenu>
            </div>
            <div ref={chatBox} className="flex grow flex-col overflow-auto px-9">
                <div className="grow"></div>
                {openedChat.conversation.map((e, i) => (<ChatBubble_1.default hisChat={e.sender !== user.username} key={i} message={e.message}/>))}
            </div>
            <div className="mt-5 flex h-[85px] items-center gap-3 px-7 py-5">
                <div className="relative h-full w-full">
                    <input_1.Input className="h-full rounded-full bg-white pl-5 transition-none placeholder:text-gray-700 focus:bg-accent" placeholder="Message..."/>
                    <im_1.ImAttachment className="absolute right-3 top-1/2 -translate-y-1/2"/>
                </div>
                <Button_1.Button className="rounded-full">
                    <bs_2.BsSend className="absolute" size="20px" color="white"/>
                </Button_1.Button>
            </div>
        </div>);
}
