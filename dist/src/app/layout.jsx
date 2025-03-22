"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const ProgressBar_1 = __importDefault(require("@/components/ProgressBar"));
const sonner_1 = require("@/components/shadcn/ui/sonner");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'SkillSwap',
    description: 'Connect with Developers',
};
function RootLayout({ children, }) {
    return (<html lang="en">
            <body className={inter.className}>
                <ProgressBar_1.default />
                <sonner_1.Toaster richColors/>
                {children}
            </body>
        </html>);
}
