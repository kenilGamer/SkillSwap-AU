'use client'

import { Button } from '@/components/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import { userSignupValidation } from '@/validations/user.validation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { IoAlertCircleOutline } from 'react-icons/io5'
import Signup from '@/actions/user/authentication/signup'
import { FcGoogle } from 'react-icons/fc'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { signIn } from 'next-auth/react'

export default function Page() {
    const form = useForm<z.infer<typeof userSignupValidation>>({
        resolver: zodResolver(userSignupValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function onSubmit(values: any) {
        setError('')
        setLoading(true)
        const res = await Signup(values)
        if (res.error) {
            setError(res.error)
            setLoading(false)
            return
        }
        setError('')
        window.location.href = '/'
    }

    return (
        <div className="accent-bg flex h-screen">
            <div className="flex basis-1/2 items-center justify-center">
                <div className="flex justify-center gap-4">
                    <div className="aspect-square h-36">
                        <img
                            className="h-full"
                            src="logo.png"
                            alt=""
                        />
                    </div>
                    <div className="w-1/2">
                        <h1 className="text-[50px] font-medium text-[#002C5D]">SKILLSWAP</h1>
                        <p className="text-[20px]">Connect with Developers and the world around them on SkillSwap.</p>
                    </div>
                </div>
            </div>
            <div className="flex basis-1/2 items-center justify-center overflow-hidden p-10">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full max-w-[400px] flex-col items-center justify-center gap-7 rounded-2xl bg-white px-5 py-7 shadow-[0px_0px_3px_1px_#00000025]"
                    >
                        <h1 className="flex items-center text-2xl font-bold tracking-wider text-[#4169E1]">Sign-Up</h1>
                        <div className="flex w-full flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="w-full space-y-1">
                                            <div className="flex items-center gap-2 overflow-hidden py-1">
                                                <FormLabel className="shrink-0 !text-black">Full Name</FormLabel>
                                                <FormMessage className="truncate text-xs" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="w-full space-y-1">
                                            <div className="flex items-center gap-2 overflow-hidden py-1">
                                                <FormLabel className="shrink-0 !text-black">Username</FormLabel>
                                                <FormMessage className="truncate text-xs" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="john123"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="w-full space-y-1">
                                            <div className="flex items-center gap-2 overflow-hidden py-1">
                                                <FormLabel className="shrink-0 !text-black">Email</FormLabel>
                                                <FormMessage className="truncate text-xs" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="john@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="w-full space-y-1">
                                            <div className="flex items-center gap-2 overflow-hidden py-1">
                                                <FormLabel className="shrink-0 !text-black">Password</FormLabel>
                                                <FormMessage className="truncate text-xs" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="*********"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                        </div>
                        {error && (
                            <div className="flex w-full items-center gap-3 rounded-md bg-red-100 px-3 py-3 text-sm font-medium text-red-400 dark:bg-red-300/10">
                                <IoAlertCircleOutline className="text-base" /> {error}
                            </div>
                        )}
                        <div className="flex w-full flex-col items-center justify-evenly gap-3">
                            <Button
                                loading={loading}
                                className="w-full space-y-1"
                            >
                                Sign-Up
                            </Button>
                            <div className="flex gap-3 items-center">
                               <button 
                                 onClick={() => signIn("google", { callbackUrl: "/dashboard" })}  
                                 type='button'
                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                               >
                                <FcGoogle className="h-8 w-8" title="Sign in with Google" />
                               </button>
                                <button>
                                <FaDiscord className="h-8 w-8 text-[#5865F2]" title="Sign in with Discord" />
                                </button>
                                <button>
                                <FaGithub className="h-8 w-8 text-black" title="Sign in with GitHub" />
                                </button>
                            </div>
                            <div className="text-sm">
                                Already a mebmer?{' '}
                                <Link
                                    href="/login"
                                    className="text-blue-600"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
