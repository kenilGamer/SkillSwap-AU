import { toast } from 'sonner'

interface ApiResponse {
    error?: string;
    success?: string;
    user?: unknown;
    [key: string]: unknown;
}

// eslint-disable-next-line no-unused-vars
export default async function callPromiseWithToast(Prom: Promise<ApiResponse>) {
    const ToastId = toast.loading('Processing your request...', {
        position: 'top-center',
    })
    const res = await Prom
    if (res?.error) {
        toast.error(res.error, { id: ToastId })
    } else if (res?.success) {
        toast.success(res.success, { id: ToastId })
    }
    return res
}
