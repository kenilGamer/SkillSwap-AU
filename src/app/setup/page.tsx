'use client';

import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/ui/form';
import { Input } from '@/components/shadcn/ui/input';
import { userSignupValidation } from '@/validations/user.validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { IoAlertCircleOutline } from 'react-icons/io5';

import { MdModeEdit } from 'react-icons/md';

export default function Page() {
    const form = useForm<z.infer<typeof userSignupValidation>>({
        resolver: zodResolver(userSignupValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
    });

    const [error, setError] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file)); // Preview image
        }
    };

    async function onSubmit(values: any) {
        setError('');
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('password', values.password);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const res = await fetch('/api/upload/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.error) {
                setError(data.error);
                return;
            }

            window.location.href = '/';
        } catch (err) {
            setError('Something went wrong');
        }
    }

    return (
        <div className="accent-bg flex h-screen">
            <div className="flex basis-1/2 items-center justify-center">
                <div className="flex justify-center gap-4">
                    <div className="aspect-square h-36">
                        <img className="h-full" src="logo.png" alt="" />
                    </div>
                    <div className="w-1/2">
                        <h1 className="text-[50px] font-medium text-[#002C5D]">SKILLSWAP</h1>
                        <p className="text-[20px]">Connect with Developers and the world around them on SkillSwap.</p>
                    </div>
                </div>
            </div>
            <div className="flex basis-1/2 items-center justify-center overflow-hidden p-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[400px] flex-col items-center gap-7 rounded-2xl bg-white px-5 py-7 shadow-md">

                        {/* Image Upload Section */}
                        <input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} hidden />
                        <div className="flex items-center justify-center w-full gap-10">
                            <div className=''>
                                <h1 className='font-[900] uppercase text-2xl'>Welcome !</h1>
                            </div>
                            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center relative">
                                {preview ? (
                                    <img src={preview} alt="Avatar Preview" className="w-full h-full rounded-full object-cover border-1 border-black" />
                                ) : (
                                    <MdModeEdit className="text-white text-2xl cursor-pointer" onClick={() => document.getElementById('avatar')?.click()} />
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className='flex gap-5 w-full'>
                            <div className='flex flex-col gap-5 w-1/2'>
                                <FormField control={form.control} name="name" rules={{ required: 'Name is required' }} render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="username" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Username</FormLabel>
                                        <FormControl><Input placeholder="enter your username" {...field} /></FormControl>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input placeholder="text@example.com" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="Country" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Country</FormLabel>
                                        <FormControl><Input placeholder="" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="*********" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                            <div className='flex flex-col gap-5 w-1/2'>
                                <FormField control={form.control} name="Website" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Website</FormLabel>
                                        <FormControl><Input placeholder="www.example.com" {...field} /></FormControl>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="Skill" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Skill</FormLabel>
                                        <FormControl><Input placeholder="Enter your codeing skills" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="bio" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl><Input type="text" placeholder="*********" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="About" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>About</FormLabel>
                                        <FormControl><Input placeholder="ENTER YOUR ABOUT" {...field} /></FormControl>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="*********" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        {error && (
                            <div className="w-full flex items-center gap-3 bg-red-100 px-3 py-2 text-sm font-medium text-red-400">
                                <IoAlertCircleOutline className="text-base" /> {error}
                            </div>
                        )}

                        <Button className="w-full">Sign-Up</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
