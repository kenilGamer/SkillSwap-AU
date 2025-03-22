"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatBubble;
function ChatBubble({ message, hisChat = false }) {
    return (<div className="my-2 flex gap-3">
            {hisChat && (<div className="aspect-square h-9 overflow-hidden rounded-full">
                    <img className="block h-full w-full object-cover" src="https://img.freepik.com/premium-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg" alt="User Avatar"/>
                </div>)}
            <div className={`max-w-[60%] break-all rounded-xl px-4 py-2 text-sm text-white ${hisChat ? 'bg-gray-300 text-black' : 'ml-auto bg-blue-500'}`}>
                {message}
            </div>
        </div>);
}
