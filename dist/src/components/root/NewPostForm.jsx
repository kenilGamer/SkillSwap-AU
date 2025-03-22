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
exports.default = NewPostForm;
const label_1 = require("@/components/shadcn/ui/label");
const textarea_1 = require("@/components/shadcn/ui/textarea");
const Button_1 = require("@/components/Button");
const react_1 = require("react");
const postRequirement_1 = __importDefault(require("@/actions/post/postRequirement"));
const post_validation_1 = require("@/validations/post.validation");
const callPromiseWithToast_1 = __importDefault(require("@/helpers/callPromiseWithToast"));
const navigation_1 = require("next/navigation");
const AddSkillTab_1 = __importDefault(require("./AddSkillTab"));
function NewPostForm() {
    const [selectedSkills, setSelectedSkills] = (0, react_1.useState)([]);
    const [skillSearchInput, setSkillSearchInput] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)({});
    const router = (0, navigation_1.useRouter)();
    function onSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = post_validation_1.postValidation.safeParse({ requiredSkills: selectedSkills, description });
            if (!validate.success)
                return setError(validate.error.formErrors.fieldErrors);
            setError({});
            const res = yield (0, callPromiseWithToast_1.default)((0, postRequirement_1.default)({ requiredSkills: selectedSkills, description }));
            if (res.success) {
                setSelectedSkills([]);
                setSkillSearchInput('');
                setDescription('');
                router.refresh();
            }
        });
    }
    return (<div className="flex w-full flex-col gap-3 p-5">
            <h2 className="text-lg font-medium text-black/70">Post your Requirement</h2>
            <div className="space-y-1">
                <div className="flex flex-col gap-1">
                    <label_1.Label>Skills</label_1.Label>
                    {(error === null || error === void 0 ? void 0 : error.requiredSkills) && <span className="text-xs text-red-500">{error === null || error === void 0 ? void 0 : error.requiredSkills}</span>}
                </div>
                <AddSkillTab_1.default skillSearchInput={skillSearchInput} setSkillSearchInput={setSkillSearchInput} setSelectedSkills={setSelectedSkills} selectedSkills={selectedSkills}/>
            </div>
            <div className="space-y-2">
                <div className="flex flex-col gap-1">
                    <label_1.Label>Description</label_1.Label>
                    {(error === null || error === void 0 ? void 0 : error.description) && <span className="text-xs text-red-500">{error === null || error === void 0 ? void 0 : error.description}</span>}
                </div>
                <textarea_1.Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-40 resize-none rounded-lg border-slate-300" placeholder="I want a slave"/>
            </div>
            <Button_1.Button onClick={onSubmit} className="mt-3 h-0 rounded-full py-4">
                Post
            </Button_1.Button>
        </div>);
}
