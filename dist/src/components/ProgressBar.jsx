"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProgressBar;
const next_nprogress_bar_1 = require("next-nprogress-bar");
function ProgressBar() {
    return (<next_nprogress_bar_1.AppProgressBar color="#6366f1" options={{ showSpinner: false }}/>);
}
