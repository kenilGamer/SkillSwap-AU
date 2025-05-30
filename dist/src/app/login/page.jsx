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
exports.default = Page;
const Button_1 = require("@/components/Button");
const form_1 = require("@/components/shadcn/ui/form");
const input_1 = require("@/components/shadcn/ui/input");
const user_validation_1 = require("@/validations/user.validation");
const link_1 = __importDefault(require("next/link"));
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const io5_1 = require("react-icons/io5");
const react_1 = require("react");
const login_1 = __importDefault(require("@/actions/user/authentication/login"));
function Page() {
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(user_validation_1.userLoginValidation),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const [error, setError] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    function onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            setError('');
            setLoading(true);
            const res = yield (0, login_1.default)(values);
            if (res.error) {
                setError(res.error);
                setLoading(false);
                return;
            }
            setError('');
            window.location.href = '/';
        });
    }
    return (<div className="accent-bg flex h-screen">
            <div className="flex basis-1/2 items-center justify-center">
                <div className="flex justify-center gap-4">
                    <div className="aspect-square h-36">
                        <img className="h-full" src="logo.png" alt=""/>
                    </div>
                    <div className="w-1/2">
                        <h1 className="text-[50px] font-medium text-[#002C5D]">SKILLSWAP</h1>
                        <p className="text-[20px]">Connect with Developers and the world around them on SkillSwap.</p>
                    </div>
                </div>
            </div>
            <div className="flex basis-1/2 items-center justify-center overflow-hidden p-10">
                <form_1.Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[400px] flex-col items-center justify-center gap-7 rounded-2xl bg-white px-5 py-7 shadow-[0px_0px_3px_1px_#00000025]">
                        <h1 className="flex items-center text-2xl font-bold tracking-wider text-[#4169E1]">Login</h1>
                        <div className="flex w-full flex-col gap-2">
                            <form_1.FormField control={form.control} name="email" render={({ field }) => {
            return (<form_1.FormItem className="w-full space-y-1">
                                            <div className="flex items-center gap-2 overflow-hidden py-1">
                                                <form_1.FormLabel className="shrink-0 !text-black">Email</form_1.FormLabel>
                                                <form_1.FormMessage className="truncate text-xs"/>
                                            </div>
                                            <form_1.FormControl>
                                                <input_1.Input placeholder="john@example.com" {...field}/>
                                            </form_1.FormControl>
                                        </form_1.FormItem>);
        }}/>
                            <form_1.FormField control={form.control} name="password" render={({ field }) => {
            return (<form_1.FormItem className="w-full space-y-1">
                                            <div className="flex items-center gap-2 overflow-hidden py-1">
                                                <form_1.FormLabel className="shrink-0 !text-black">Password</form_1.FormLabel>
                                                <form_1.FormMessage className="truncate text-xs"/>
                                            </div>
                                            <form_1.FormControl>
                                                <input_1.Input type="password" placeholder="*********" {...field}/>
                                            </form_1.FormControl>
                                            <a href="#" className="block pt-1 text-sm text-blue-600">
                                                Forgot Password ?
                                            </a>
                                            {error && (<div className="flex w-full items-center gap-3 rounded-md bg-red-100 px-3 py-3 text-sm font-medium text-red-400 dark:bg-red-300/10">
                                                    <io5_1.IoAlertCircleOutline className="text-base"/> {error}
                                                </div>)}
                                        </form_1.FormItem>);
        }}/>
                        </div>
                        <div className="flex w-full flex-col items-center justify-evenly gap-3">
                            <Button_1.Button loading={loading} className="w-full space-y-1">
                                Sign-Up
                            </Button_1.Button>
                            <div className="flex gap-3">
                                {/* prettier-ignore */}
                                <svg className="h-8" xmlns="http://www.w3.org/2000/svg" width="28" viewBox="0 0 55 55" fill="none"> <g clipPath="url(#clip0_10_173)"> <path d="M19.3435 2.36489C13.9035 4.23684 9.21201 7.78985 5.95819 12.502C2.70437 17.2142 1.05971 22.8373 1.2658 28.5451C1.4719 34.253 3.51787 39.7449 7.10321 44.2141C10.6885 48.6834 15.6243 51.8944 21.1854 53.3755C25.6939 54.5294 30.4175 54.5801 34.9501 53.5232C39.0562 52.6083 42.8524 50.6514 45.967 47.8441C49.2086 44.833 51.5615 41.0025 52.7728 36.7644C54.089 32.1555 54.3232 27.3088 53.4576 22.5961H28.14V33.0135H42.8023C42.5093 34.6749 41.8813 36.2607 40.956 37.6758C40.0307 39.091 38.8271 40.3064 37.4172 41.2494C35.627 42.4246 33.6086 43.2151 31.4919 43.57C29.3691 43.9616 27.1917 43.9616 25.0689 43.57C22.9172 43.1292 20.8818 42.2484 19.0926 40.9836C16.2178 38.9651 14.0592 36.0974 12.9248 32.7898C11.7716 29.4203 11.7716 25.7674 12.9248 22.3978C13.7323 20.036 15.0671 17.8855 16.8297 16.107C18.8467 14.0342 21.4003 12.5527 24.2104 11.8248C27.0204 11.0968 29.9783 11.1507 32.7595 11.9805C34.9322 12.6418 36.9191 13.7977 38.5614 15.3559C40.2147 13.7245 41.8651 12.0888 43.5127 10.449C44.3634 9.56714 45.2907 8.72751 46.1286 7.82459C43.6213 5.51041 40.6783 3.70958 37.4683 2.52522C31.6225 0.419781 25.2262 0.363199 19.3435 2.36489Z" fill="white"/> <path d="M19.3435 2.3645C25.2257 0.361448 31.622 0.41654 37.4683 2.52061C40.6789 3.71302 43.6205 5.52252 46.1244 7.8453C45.2737 8.74821 44.3762 9.59206 43.5084 10.4697C41.858 12.1039 40.209 13.7325 38.5614 15.3555C36.9191 13.7973 34.9322 12.6414 32.7595 11.9802C29.9792 11.1474 27.0214 11.0904 24.2106 11.8154C21.3998 12.5403 18.8446 14.0191 16.8254 16.0897C15.0628 17.8682 13.728 20.0187 12.9206 22.3806L4.1028 15.6087C7.25903 9.40034 12.7238 4.65143 19.3435 2.3645Z" fill="#E33629"/> <path d="M1.76329 22.3175C2.23689 19.9875 3.02375 17.7311 4.10279 15.6089L12.9206 22.3976C11.7674 25.7672 11.7674 29.4201 12.9206 32.7896C9.98272 35.0399 7.04346 37.3014 4.10279 39.5742C1.40238 34.2424 0.578796 28.1675 1.76329 22.3175Z" fill="#F8BD00"/> <path d="M28.14 22.5918H53.4576C54.3232 27.3044 54.0889 32.1511 52.7728 36.76C51.5615 40.9981 49.2086 44.8287 45.967 47.8397C43.1213 45.6373 40.2629 43.4517 37.4172 41.2493C38.828 40.3053 40.0322 39.0886 40.9575 37.6719C41.8829 36.2553 42.5103 34.6679 42.8023 33.0049H28.14C28.1358 29.5367 28.14 26.0642 28.14 22.5918Z" fill="#587DBD"/> <path d="M4.09854 39.5741C7.03922 37.3238 9.97847 35.0623 12.9163 32.7896C14.0529 36.0983 16.2146 38.9661 19.0926 40.9833C20.8874 42.2422 22.9272 43.1159 25.0817 43.5486C27.2045 43.9402 29.3819 43.9402 31.5047 43.5486C33.6214 43.1937 35.6398 42.4032 37.43 41.228C40.2757 43.4305 43.1341 45.616 45.9798 47.8185C42.8656 50.6273 39.0694 52.5857 34.9629 53.5018C30.4302 54.5587 25.7066 54.5081 21.1981 53.3541C17.6323 52.4097 14.3016 50.7449 11.4148 48.464C8.35952 46.0575 5.86395 43.0251 4.09854 39.5741Z" fill="#319F43"/> </g> <defs> <clipPath id="clip0_10_173"> <rect width="54.4464" height="54.0063" fill="white" transform="translate(0.376617 0.588379)"/> </clipPath> </defs> </svg>
                                {/* prettier-ignore */}
                                <svg className="h-8" xmlns="http://www.w3.org/2000/svg" width="32" viewBox="0 0 56 43" fill="none"> <g clipPath="url(#clip0_10_179)"> <path d="M46.898 4.14056C43.3274 2.48914 39.5499 1.31574 35.6654 0.651367C35.1816 1.51604 34.6163 2.67904 34.2264 3.60426C30.0383 2.98177 25.8887 2.98177 21.7776 3.60426C21.3879 2.67925 20.8099 1.51604 20.3215 0.651367C16.4333 1.31604 12.6526 2.49244 9.08026 4.14918C1.97159 14.7677 0.0444869 25.1222 1.00793 35.3301C5.72287 38.8105 10.2921 40.9248 14.7844 42.3083C15.9008 40.7907 16.8877 39.184 17.7349 37.5048C16.122 36.8978 14.5671 36.1498 13.0887 35.2696C13.4777 34.9845 13.8576 34.6875 14.2278 34.3788C23.1864 38.5208 32.9204 38.5208 41.7722 34.3788C42.1439 34.6854 42.5237 34.9825 42.9111 35.2696C41.4303 36.1521 39.8725 36.9016 38.2563 37.5092C39.1083 39.1952 40.0935 40.8035 41.2068 42.3125C45.7034 40.9292 50.2769 38.8149 54.9918 35.3301C56.1224 23.4967 53.0606 13.2372 46.898 4.14056ZM18.9555 29.0524C16.2661 29.0524 14.0606 26.5707 14.0606 23.5486C14.0606 20.5265 16.2191 18.0406 18.9555 18.0406C21.6921 18.0406 23.8973 20.5221 23.8503 23.5486C23.8546 26.5707 21.6921 29.0524 18.9555 29.0524ZM37.0442 29.0524C34.3549 29.0524 32.1496 26.5707 32.1496 23.5486C32.1496 20.5265 34.3079 18.0406 37.0442 18.0406C39.7808 18.0406 41.9861 20.5221 41.9391 23.5486C41.9391 26.5707 39.7808 29.0524 37.0442 29.0524Z" fill="#5865F2"/> </g> <defs> <clipPath id="clip0_10_179"> <rect width="54.4464" height="41.8358" fill="white" transform="translate(0.776764 0.651367)"/> </clipPath> </defs> </svg>
                                {/* prettier-ignore */}
                                <svg className="h-8" xmlns="http://www.w3.org/2000/svg" width="28" viewBox="0 0 55 55" fill="none"> <path fillRule="evenodd" clipRule="evenodd" d="M27.4001 2.7417C13.2156 2.7417 1.71332 14.1484 1.71332 28.2208C1.71332 39.4786 9.07337 49.0289 19.2795 52.3984C20.5628 52.6346 21.0341 51.8456 21.0341 51.1727C21.0341 50.5651 21.0103 48.558 20.9993 46.429C13.8532 47.9703 12.3453 43.4228 12.3453 43.4228C11.1768 40.4777 9.4932 39.6946 9.4932 39.6946C7.16222 38.1133 9.66888 38.1462 9.66888 38.1462C12.2479 38.3255 13.6065 40.7718 13.6065 40.7718C15.8975 44.6662 19.6156 43.5405 21.0814 42.8899C21.3119 41.2431 21.9776 40.1187 22.7122 39.4824C17.0068 38.839 11.0088 36.6538 11.0088 26.8909C11.0088 24.1092 12.0126 21.8363 13.6558 20.0516C13.3887 19.4102 12.5095 16.8188 13.9042 13.3092C13.9042 13.3092 16.0608 12.6244 20.9695 15.9209C23.0189 15.356 25.2167 15.072 27.4001 15.0623C29.5822 15.072 31.7814 15.3551 33.8346 15.9201C38.7373 12.6236 40.8914 13.3084 40.8914 13.3084C42.2895 16.8175 41.4103 19.4094 41.1436 20.0507C42.7906 21.8354 43.7872 24.1084 43.7872 26.8901C43.7872 36.6762 37.7781 38.8305 32.0583 39.4617C32.98 40.2524 33.801 41.8034 33.801 44.1801C33.801 47.5893 33.7712 50.333 33.7712 51.1722C33.7712 51.8503 34.234 52.6448 35.5356 52.3946C45.7358 49.0217 53.0874 39.4744 53.0874 28.2208C53.0869 14.1493 41.586 2.7417 27.4001 2.7417Z" fill="#181616"/> <path d="M11.4422 39.3239C11.3857 39.4505 11.1849 39.4884 11.002 39.4019C10.8148 39.3192 10.7106 39.1467 10.771 39.0197C10.8263 38.8889 11.0275 38.853 11.2134 38.9404C11.4005 39.0235 11.5069 39.1977 11.4418 39.3243L11.4422 39.3239ZM12.4827 40.4753C12.3606 40.588 12.1211 40.5356 11.9586 40.3572C11.7902 40.18 11.7587 39.9424 11.8833 39.8281C12.0101 39.7159 12.2423 39.769 12.4108 39.9462C12.5784 40.126 12.6116 40.3614 12.4831 40.4757L12.4827 40.4753ZM13.4959 41.9423C13.3385 42.0512 13.0807 41.9495 12.9216 41.7229C12.7643 41.4959 12.7643 41.2238 12.9259 41.1154C13.0846 41.0065 13.3385 41.1048 13.5001 41.3293C13.6567 41.5592 13.6567 41.8318 13.4959 41.9423ZM14.883 43.3604C14.7426 43.5144 14.4423 43.4731 14.2228 43.2634C13.9987 43.0579 13.9361 42.7655 14.0769 42.6119C14.2199 42.4575 14.5214 42.5006 14.7422 42.709C14.9664 42.914 15.034 43.2069 14.8838 43.36L14.883 43.3604ZM16.7971 44.1836C16.7346 44.3832 16.4462 44.4739 16.1548 44.3887C15.8643 44.3013 15.6742 44.068 15.7337 43.8663C15.7933 43.6651 16.0838 43.571 16.3769 43.6617C16.6674 43.7486 16.8575 43.9807 16.7971 44.1836ZM18.8997 44.3359C18.9069 44.546 18.6602 44.7199 18.3552 44.7241C18.0477 44.7313 17.7989 44.5608 17.7959 44.3541C17.7959 44.1418 18.0375 43.9701 18.3446 43.9642C18.6496 43.9587 18.9001 44.1275 18.9001 44.3355L18.8997 44.3359ZM20.8555 44.006C20.8921 44.2106 20.6798 44.4211 20.3766 44.4773C20.0788 44.5321 19.8023 44.4047 19.764 44.2017C19.7274 43.9916 19.9435 43.7811 20.2413 43.7267C20.545 43.6748 20.8172 43.798 20.8555 44.006Z" fill="#181616"/> </svg>
                            </div>
                            <div className="text-sm">
                                Not a mebmer?{' '}
                                <link_1.default href="/signup" className="text-blue-600">
                                    Sign Up
                                </link_1.default>
                            </div>
                        </div>
                    </form>
                </form_1.Form>
            </div>
        </div>);
}
