"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Profile;
const badge_1 = require("@/components/shadcn/ui/badge");
const react_1 = __importDefault(require("react"));
const EditProfile_1 = __importDefault(require("./EditProfile"));
const valtio_1 = require("valtio");
const user_store_1 = __importDefault(require("@/store/user.store"));
const RequirementCard_1 = __importDefault(require("@/components/root/RequirementCard"));
function Profile({ posts }) {
    var _a, _b, _c;
    const { user } = (0, valtio_1.useSnapshot)(user_store_1.default);
    return (<div className="flex w-full flex-col gap-5 overflow-auto bg-accent p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-black/80">Your Profile</h1>
                <EditProfile_1.default user={user}/>
            </div>
            <div className="flex flex-col gap-5 rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                    <div className="aspect-square h-full shrink-0 overflow-hidden rounded-xl bg-red-200">
                        {user.image ? (<img className="h-full w-full object-cover" src={user.image} alt=""/>) : (<div className="flex h-full w-full items-center justify-center bg-blue-300 text-3xl">{(_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.split('')[0]}</div>)}
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <div>
                            <h2 className="text-xl font-medium text-black/90">{user.name}</h2>
                        </div>
                        <hr />
                        <div className="flex gap-20">
                            <div className="flex flex-col gap-1 text-sm text-black/80">
                                <span>Username</span>
                                <span>Country</span>
                                <span>Email</span>
                                <span>Website</span>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-black/90">
                                <span>{user.username || 'unset'}</span>
                                <span>{user.country || 'unset'}</span>
                                <span>{user.email || 'unset'}</span>
                                {user.website ? (<a target="_blank" className="text-blue-600" href={user.website}>
                                        {user.website}
                                    </a>) : (<span>unset</span>)}
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-black/80">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {!((_b = user.skills) === null || _b === void 0 ? void 0 : _b.length) && <span className="text-sm text-black/70">{"You haven't added any skills yet"}</span>}
                        {(_c = user === null || user === void 0 ? void 0 : user.skills) === null || _c === void 0 ? void 0 : _c.map((name, i) => (<badge_1.Badge className="rounded-full bg-indigo-500 hover:bg-indigo-500" key={i}>
                                {name}
                            </badge_1.Badge>))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-black/80">Bio</h2>
                    <p className="text-sm text-black/70">{user.bio || <span className="text-sm text-black/70">{"You haven't added your bio"}</span>}</p>
                </div>
            </div>
            {posts.length !== 0 && (<div>
                    <h2 className="mb-2 text-xl font-bold text-black/80">Posts</h2>
                    <div className="flex flex-col gap-5">
                        {posts.map((data, i) => (<RequirementCard_1.default key={i} data={data} myPost/>))}
                    </div>
                </div>)}
        </div>);
}
