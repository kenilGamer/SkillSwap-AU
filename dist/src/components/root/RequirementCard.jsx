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
exports.default = RequirementCard;
const badge_1 = require("@/components/shadcn/ui/badge");
const Button_1 = require("../Button");
const luxon_1 = require("luxon");
const link_1 = __importDefault(require("next/link"));
const callPromiseWithToast_1 = __importDefault(require("@/helpers/callPromiseWithToast"));
const deleteMyPost_1 = __importDefault(require("@/actions/data/deleteMyPost"));
const navigation_1 = require("next/navigation");
function RequirementCard({ data, myPost }) {
    var _a, _b, _c, _d, _e, _f, _g;
    const router = (0, navigation_1.useRouter)();
    return (<div className="flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="aspect-square h-10 shrink-0 overflow-hidden rounded-full">
                    {((_a = data.owner) === null || _a === void 0 ? void 0 : _a.image) ? (<img className="h-full w-full object-cover" src={data.owner.image} alt=""/>) : (<div className="flex h-full w-full items-center justify-center bg-blue-300">
                            {((_c = (_b = data.owner) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.charAt(0)) || "?"}
                        </div>)}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <link_1.default href={`/profile/${((_e = (_d = data.owner) === null || _d === void 0 ? void 0 : _d._id) === null || _e === void 0 ? void 0 : _e.toString()) || '#'}`} className="truncate font-medium text-black/70">
                        {((_f = data.owner) === null || _f === void 0 ? void 0 : _f.name) || "Unknown"}
                    </link_1.default>
                    <span className="text-xs text-black/70">
                        {luxon_1.DateTime.fromISO(data.createdAt.toString()).toFormat('hh:mm a | dd LLL yyyy')}
                    </span>
                </div>
                {!myPost && <Button_1.Button className="ml-auto h-7 rounded-full text-xs">Chat</Button_1.Button>}
                {myPost && (<Button_1.Button className="ml-auto h-7 rounded-full bg-red-400 text-xs hover:bg-red-400/80" onClick={() => __awaiter(this, void 0, void 0, function* () {
                const res = yield (0, callPromiseWithToast_1.default)((0, deleteMyPost_1.default)(data._id));
                if (!res.error)
                    router.refresh();
            })}>
                        Delete
                    </Button_1.Button>)}
            </div>
            <p className='text-sm text-black/70'>{data.description || "No description provided"}</p>
            <div className="flex flex-col gap-2 rounded-xl bg-accent p-3">
                <h3 className="text-sm font-medium text-black/80">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {((_g = data.requiredSkills) === null || _g === void 0 ? void 0 : _g.length) ? (data.requiredSkills.map((name, i) => (<badge_1.Badge key={i} className="pointer-events-none rounded-full bg-indigo-500 bg-gradient-to-tr">
                                {name}
                            </badge_1.Badge>))) : (<span className="text-xs text-black/50">No skills listed</span>)}
                </div>
            </div>
        </div>);
}
