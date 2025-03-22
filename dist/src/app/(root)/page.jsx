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
const Button_1 = require("@/components/Button");
const RequirementCard_1 = __importDefault(require("@/components/root/RequirementCard"));
const NewPostForm_1 = __importDefault(require("../../components/root/NewPostForm"));
const dialog_1 = require("@/components/shadcn/ui/dialog");
const getPosts_1 = __importDefault(require("@/actions/data/getPosts"));
function page() {
    return __awaiter(this, void 0, void 0, function* () {
        const { posts, error } = yield (0, getPosts_1.default)();
        return (<div className="flex w-full gap-5 overflow-hidden p-5 xl:p-7">
            <div className="flex w-full flex-col gap-5 rounded-2xl xl:p-7 xl:shadow-[0px_0px_2px_1px_#00000030]">
                <div className="flex">
                    <h1 className="text-xl font-medium text-black/70">Active Requirements</h1>
                    <dialog_1.Dialog>
                        <dialog_1.DialogTrigger asChild>
                            <Button_1.Button className="ml-auto flex h-7 rounded-full xl:hidden">New Post</Button_1.Button>
                        </dialog_1.DialogTrigger>
                        <dialog_1.DialogContent className="p-0">
                            <NewPostForm_1.default />
                        </dialog_1.DialogContent>
                    </dialog_1.Dialog>
                </div>
                <div className="no-scrollbar flex h-full w-full flex-col gap-5 overflow-auto">
                    {error && <div>Something went wrong</div>}
                    {(posts === null || posts === void 0 ? void 0 : posts.length) ? (posts.map((data, i) => (<RequirementCard_1.default key={i} data={data}/>))) : (<div className="flex h-full w-full items-center justify-center text-lg font-medium text-black/60">There is no available posts</div>)}
                </div>
            </div>
            <div className="hidden h-fit w-80 shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_2px_1px_#00000030] xl:block">
                <NewPostForm_1.default />
            </div>
        </div>);
    });
}
