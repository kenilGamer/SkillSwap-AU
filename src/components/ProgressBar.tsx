'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export default function ProgressBar() {
    return (
        <AppProgressBar
            color="#6366f1"
            options={{ showSpinner: false }}
        />
    )
}
