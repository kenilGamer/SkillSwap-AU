"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const valtio_1 = require("valtio");
const chat_data_1 = __importDefault(require("../dummy_data/chat_data"));
const utils_1 = require("valtio/utils");
const chatStore = (0, valtio_1.proxy)({
    chats: chat_data_1.default,
    openedChat: null,
    setOpenedChat(id) {
        const chat = this.chats.filter((chat) => chat.id === id);
        this.openedChat = chat[0];
    },
});
(0, utils_1.devtools)(chatStore, { name: 'chatStore', enabled: true });
exports.default = chatStore;
