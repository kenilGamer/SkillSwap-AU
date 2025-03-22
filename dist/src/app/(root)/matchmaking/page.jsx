"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.default = Page;
const getMatchedUser_1 = __importDefault(require("@/actions/data/getMatchedUser"));
const Button_1 = require("@/components/Button");
const AddSkillTab_1 = __importDefault(require("@/components/root/AddSkillTab"));
const badge_1 = require("@/components/shadcn/ui/badge");
const dialog_1 = require("@/components/shadcn/ui/dialog");
const label_1 = require("@/components/shadcn/ui/label");
const skeleton_1 = require("@/components/shadcn/ui/skeleton");
const getDummyUsers_1 = __importStar(require("@/helpers/getDummyUsers"));
const user_store_1 = __importDefault(require("@/store/user.store"));
const react_1 = require("react");
const vsc_1 = require("react-icons/vsc");
const sonner_1 = require("sonner");
const valtio_1 = require("valtio");
function Page() {
    const { user } = (0, valtio_1.useSnapshot)(user_store_1.default);
    const [requestMatchClicked, setRequestMatchClicked] = (0, react_1.useState)(false);
    const [isDialogOpen, setIsDialogOpen] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [matchedSkills, setMatchedSkills] = (0, react_1.useState)(null);
    const [matchedUser, setMatchedUser] = (0, react_1.useState)(null);
    const [selectedSkills, setSelectedSkills] = (0, react_1.useState)([]);
    const [setSkillSearchInput, setSetSkillSearchInput] = (0, react_1.useState)('');
    function handleFindBuddy() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            setIsLoading(true);
            const dummyUsers = (0, getDummyUsers_1.default)();
            const interval = setInterval(() => {
                setMatchedUser((0, getDummyUsers_1.pickRandom)(dummyUsers));
            }, 200);
            const res = yield (0, getMatchedUser_1.default)(selectedSkills);
            if (res.error || !res.user) {
                sonner_1.toast.warning(res.error || 'No user was found', { position: 'top-center' });
            }
            clearInterval(interval);
            setMatchedUser(res.user);
            setMatchedSkills((_a = res.user) === null || _a === void 0 ? void 0 : _a.skills);
            setRequestMatchClicked(true);
            setIsLoading(false);
        });
    }
    return (<div className="flex h-full w-full items-center justify-center">
            <div className="relative flex h-full w-full max-w-[1024px] flex-col items-center justify-center gap-10 rounded-2xl border bg-accent shadow-sm sm:gap-14 lg:max-h-[700px]">
                <h1 className="absolute left-0 top-0 mt-5 w-full text-center text-xl font-bold tracking-wide text-black/60">Find Your Buddy</h1>
                <div className="flex w-full items-center justify-center gap-5 sm:gap-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="aspect-square h-20 overflow-hidden rounded-full sm:h-24 md:h-32">
                            <img className="h-full w-full" src="/avatar/user1.png" alt=""/>
                        </div>
                        <span className="text-sm font-medium text-black/80">{user.name}</span>
                    </div>
                    <vsc_1.VscArrowSwap className="text-4xl"/>
                    <div className="flex flex-col items-center gap-2">
                        <div className="aspect-square h-20 overflow-hidden rounded-full sm:h-24 md:h-32">
                            {(matchedUser === null || matchedUser === void 0 ? void 0 : matchedUser.imageLink) ? (<img className="h-full w-full" src={matchedUser.imageLink} alt=""/>) : (<div className="flex h-full w-full items-center justify-center bg-slate-300">???</div>)}
                        </div>
                        <span className="text-sm font-medium text-black/80">{(matchedUser === null || matchedUser === void 0 ? void 0 : matchedUser.name) || '???'}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <h2>Users Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills
            ? matchedSkills.map((e, i) => (<badge_1.Badge key={i} className="pointer-events-none bg-indigo-500 text-xs">
                                      {e}
                                  </badge_1.Badge>))
            : [1, 2, 3].map((i) => (<skeleton_1.Skeleton key={i} className="w-fit">
                                      <badge_1.Badge className="text-xs opacity-0">React</badge_1.Badge>
                                  </skeleton_1.Skeleton>))}
                    </div>
                </div>
                <div className="flex w-full flex-col items-center gap-3">
                    {requestMatchClicked && (<Button_1.Button loading={isLoading} variant="outline" className="w-full max-w-52 border-2 border-slate-600">
                            Send Message
                        </Button_1.Button>)}
                    <dialog_1.Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
                        <dialog_1.DialogTrigger asChild>
                            <Button_1.Button loading={isLoading} className="w-full max-w-52" onClick={() => {
            if (requestMatchClicked) {
                // e.preventDefault()
                // handleFindBuddy()
            }
        }}>
                                Request {requestMatchClicked ? 'Rematch' : 'Match'}
                            </Button_1.Button>
                        </dialog_1.DialogTrigger>
                        <dialog_1.DialogContent>
                            <dialog_1.DialogHeader>
                                <dialog_1.DialogTitle className="text-slate-700">Your Preference</dialog_1.DialogTitle>
                                <dialog_1.DialogDescription>We will search for your buddy based on your preference</dialog_1.DialogDescription>
                            </dialog_1.DialogHeader>
                            <label_1.Label>Skill</label_1.Label>
                            <AddSkillTab_1.default selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} setSkillSearchInput={setSetSkillSearchInput} skillSearchInput={setSkillSearchInput}/>
                            <div className="flex gap-2">
                                <dialog_1.DialogClose asChild>
                                    <Button_1.Button variant="outline" className="w-full border-slate-600">
                                        Close
                                    </Button_1.Button>
                                </dialog_1.DialogClose>
                                <Button_1.Button className="w-full" onClick={() => {
            handleFindBuddy();
            setIsDialogOpen(false);
        }}>
                                    Find
                                </Button_1.Button>
                            </div>
                        </dialog_1.DialogContent>
                    </dialog_1.Dialog>
                </div>
            </div>
        </div>);
}
