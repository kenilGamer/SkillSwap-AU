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
exports.default = EditProfile;
const Button_1 = require("@/components/Button");
const AddSkillTab_1 = __importDefault(require("@/components/root/AddSkillTab"));
const dialog_1 = require("@/components/shadcn/ui/dialog");
const input_1 = require("@/components/shadcn/ui/input");
const label_1 = require("@/components/shadcn/ui/label");
const textarea_1 = require("@/components/shadcn/ui/textarea");
const react_1 = require("react");
const select_1 = require("@/components/shadcn/ui/select");
const countries_1 = __importDefault(require("@/constants/countries"));
const user_validation_1 = require("@/validations/user.validation");
const updateProfile_1 = __importDefault(require("@/actions/user/data/updateProfile"));
const callPromiseWithToast_1 = __importDefault(require("@/helpers/callPromiseWithToast"));
const dialog_2 = require("@/components/shadcn/ui/dialog");
const user_store_1 = __importDefault(require("@/store/user.store"));
function EditProfile({ user }) {
    const [isDialogOpen, setIsDialogOpen] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [selectedSkills, setSelectedSkills] = (0, react_1.useState)(user.skills);
    const [skillSearchInput, setSkillSearchInput] = (0, react_1.useState)('');
    const [name, setName] = (0, react_1.useState)(user.name);
    const [username, setUsername] = (0, react_1.useState)(user.username);
    const [country, setCountry] = (0, react_1.useState)(user.country || '');
    const [website, setWebsite] = (0, react_1.useState)(user.website || '');
    const [bio, setBio] = (0, react_1.useState)(user.bio);
    const [error, setError] = (0, react_1.useState)({});
    function onSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = user_validation_1.userValidation.safeParse({ name, username, country, website, bio, skills: selectedSkills });
            if (!validate.success) {
                console.error(validate.error.formErrors);
                return setError(validate.error.formErrors.fieldErrors);
            }
            setError({});
            setLoading(true);
            const res = yield (0, callPromiseWithToast_1.default)((0, updateProfile_1.default)(validate.data));
            if (res.success) {
                setIsDialogOpen(false);
                user_store_1.default.setUser(res.user);
            }
            setLoading(false);
        });
    }
    return (<dialog_2.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <dialog_2.DialogTrigger asChild>
                <Button_1.Button>Edit Profile</Button_1.Button>
            </dialog_2.DialogTrigger>
            <dialog_2.DialogContent className="max-h-screen max-w-2xl overflow-auto p-0">
                <div className="flex flex-col gap-5 p-5">
                    <h2 className="text-lg font-bold ">Edit Your Profile</h2>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <label_1.Label>Name</label_1.Label>
                            {(error === null || error === void 0 ? void 0 : error.name) && <span className="text-xs text-red-500">{error === null || error === void 0 ? void 0 : error.name[0]}</span>}
                        </div>
                        <input_1.Input value={name} onChange={(e) => setName(e.target.value)}></input_1.Input>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <label_1.Label>Username</label_1.Label>
                            {(error === null || error === void 0 ? void 0 : error.username) && <span className="text-xs text-red-500">{error === null || error === void 0 ? void 0 : error.username[0]}</span>}
                        </div>
                        <input_1.Input value={username} onChange={(e) => setUsername(e.target.value)}></input_1.Input>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex w-full flex-col gap-3">
                            <label_1.Label>Country</label_1.Label>
                            <select_1.Select value={country} onValueChange={(e) => setCountry(e)}>
                                <select_1.SelectTrigger>
                                    <select_1.SelectValue placeholder={'Select A Country'}/>
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                    {countries_1.default.map((e, i) => (<select_1.SelectItem key={i} value={e}>
                                            {e}
                                        </select_1.SelectItem>))}
                                </select_1.SelectContent>
                            </select_1.Select>
                        </div>
                        <div className="flex w-full flex-col gap-3">
                            <label_1.Label>Website</label_1.Label>
                            <input_1.Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="url"></input_1.Input>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label_1.Label>Skills</label_1.Label>
                        <AddSkillTab_1.default skillSearchInput={skillSearchInput} setSkillSearchInput={setSkillSearchInput} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills}/>
                    </div>
                    <div className="space-y-1">
                        <label_1.Label>About Me</label_1.Label>
                        <textarea_1.Textarea className="h-32 resize-none" value={bio} onChange={(e) => setBio(e.target.value)}/>
                    </div>
                    <div className="flex gap-2">
                        <dialog_1.DialogClose className="ml-auto">
                            <Button_1.Button variant="secondary">Close</Button_1.Button>
                        </dialog_1.DialogClose>
                        <Button_1.Button loading={loading} onClick={onSubmit}>
                            Update Profile
                        </Button_1.Button>
                    </div>
                </div>
            </dialog_2.DialogContent>
        </dialog_2.Dialog>);
}
