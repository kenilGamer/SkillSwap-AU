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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandSeparator = exports.CommandShortcut = exports.CommandItem = exports.CommandGroup = exports.CommandEmpty = exports.CommandList = exports.CommandInput = exports.CommandDialog = exports.Command = void 0;
const React = __importStar(require("react"));
const react_icons_1 = require("@radix-ui/react-icons");
const cmdk_1 = require("cmdk");
const utils_1 = require("@/components/shadcn/utils");
const dialog_1 = require("@/components/shadcn/ui/dialog");
const Command = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command ref={ref} className={(0, utils_1.cn)('flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50', className)} {...props}/>);
});
exports.Command = Command;
Command.displayName = cmdk_1.Command.displayName;
const CommandDialog = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (<dialog_1.Dialog {...props}>
            <dialog_1.DialogContent className="overflow-hidden p-0">
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 dark:[&_[cmdk-group-heading]]:text-slate-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">{children}</Command>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
};
exports.CommandDialog = CommandDialog;
const CommandInput = React.forwardRef((_a, ref) => {
    var { className, hidden } = _a, props = __rest(_a, ["className", "hidden"]);
    return (<div className={`${hidden ? 'hidden' : 'flex'} items-center border-b px-3`} cmdk-input-wrapper="">
        <react_icons_1.MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
        <cmdk_1.Command.Input ref={ref} className={(0, utils_1.cn)('flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400', className)} {...props}/>
    </div>);
});
exports.CommandInput = CommandInput;
CommandInput.displayName = cmdk_1.Command.Input.displayName;
const CommandList = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.List ref={ref} className={(0, utils_1.cn)('max-h-[300px] overflow-y-auto overflow-x-hidden', className)} {...props}/>);
});
exports.CommandList = CommandList;
CommandList.displayName = cmdk_1.Command.List.displayName;
const CommandEmpty = React.forwardRef((props, ref) => (<cmdk_1.Command.Empty ref={ref} className="py-6 text-center text-sm" {...props}/>));
exports.CommandEmpty = CommandEmpty;
CommandEmpty.displayName = cmdk_1.Command.Empty.displayName;
const CommandGroup = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Group ref={ref} className={(0, utils_1.cn)('overflow-hidden p-1 text-slate-950 dark:text-slate-50 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 dark:[&_[cmdk-group-heading]]:text-slate-400', className)} {...props}/>);
});
exports.CommandGroup = CommandGroup;
CommandGroup.displayName = cmdk_1.Command.Group.displayName;
const CommandSeparator = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Separator ref={ref} className={(0, utils_1.cn)('-mx-1 h-px bg-slate-200 dark:bg-slate-800', className)} {...props}/>);
});
exports.CommandSeparator = CommandSeparator;
CommandSeparator.displayName = cmdk_1.Command.Separator.displayName;
const CommandItem = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Item ref={ref} className={(0, utils_1.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50", className)} {...props}/>);
});
exports.CommandItem = CommandItem;
CommandItem.displayName = cmdk_1.Command.Item.displayName;
const CommandShortcut = (_a) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<span className={(0, utils_1.cn)('ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400', className)} {...props}/>);
};
exports.CommandShortcut = CommandShortcut;
CommandShortcut.displayName = 'CommandShortcut';
