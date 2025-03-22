"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddSkillTab;
const react_1 = require("react");
const input_1 = require("../shadcn/ui/input");
const fa_1 = require("react-icons/fa");
const badge_1 = require("../shadcn/ui/badge");
const io5_1 = require("react-icons/io5");
const minisearch_1 = __importDefault(require("minisearch"));
const skills_1 = __importDefault(require("@/constants/skills"));
function AddSkillTab({ selectedSkills, setSelectedSkills, skillSearchInput, setSkillSearchInput }) {
    const [skillDropdownOpen, setSkillDropdownOpen] = (0, react_1.useState)(false);
    const skillsTab = (0, react_1.useRef)(null);
    function removeSkill(name) {
        setSelectedSkills((prev) => prev.filter((e) => e !== name));
    }
    function addSkill(name) {
        if (selectedSkills.includes(name))
            removeSkill(name);
        else
            setSelectedSkills((prev) => [...prev, name]);
    }
    function hideSkillsTab(e) {
        var _a;
        !((_a = skillsTab.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) && setSkillDropdownOpen(false);
    }
    (0, react_1.useEffect)(() => {
        document.addEventListener('click', hideSkillsTab);
        return () => document.removeEventListener('click', hideSkillsTab);
    }, []);
    const miniSearch = new minisearch_1.default({
        fields: ['text'],
        storeFields: ['text'],
        searchOptions: {
            fuzzy: true,
            prefix: true,
        },
    });
    miniSearch.addAll(skills_1.default);
    return (<>
            <div className="flex flex-wrap gap-2 py-2">
                {selectedSkills.map((name, i) => (<badge_1.Badge className="gap-1 rounded-full bg-indigo-500 pr-1.5 hover:bg-indigo-500" key={i}>
                        <span>{name}</span>
                        <io5_1.IoClose onClick={() => removeSkill(name)} className="pointer-events-auto cursor-pointer"/>
                    </badge_1.Badge>))}
                {!selectedSkills.length && <span className="text-sm text-black/80">You have&apos;t added any skills</span>}
            </div>
            <div ref={skillsTab} className="relative">
                <input_1.Input value={skillSearchInput} onChange={(e) => setSkillSearchInput(e.target.value)} placeholder="Add new skill" onFocus={() => setSkillDropdownOpen(true)}/>
                {skillDropdownOpen && (<div className="absolute top-10 h-32 w-full overflow-auto rounded-md bg-white p-2 text-sm shadow-lg">
                        {(skillSearchInput ? miniSearch.search(skillSearchInput) : skills_1.default).map(({ text }, i) => (<div onClick={() => addSkill(text)} key={i} className="flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-slate-100">
                                <fa_1.FaCheck className={`text-xs text-slate-600 ${!selectedSkills.includes(text) && 'opacity-0'}`}/>
                                {text}
                            </div>))}
                    </div>)}
            </div>
        </>);
}
