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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = callPromiseWithToast;
const sonner_1 = require("sonner");
// eslint-disable-next-line no-unused-vars
function callPromiseWithToast(Prom) {
    return __awaiter(this, void 0, void 0, function* () {
        const ToastId = sonner_1.toast.loading('Processing your request...', {
            position: 'top-center',
        });
        const res = yield Prom;
        if (res === null || res === void 0 ? void 0 : res.error) {
            sonner_1.toast.error(res.error, { id: ToastId });
        }
        else if (res === null || res === void 0 ? void 0 : res.success) {
            sonner_1.toast.success(res.success, { id: ToastId });
        }
        return res;
    });
}
