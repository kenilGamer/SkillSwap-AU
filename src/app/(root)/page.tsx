import { Button } from '@/components/Button'
import NewPostForm from '../../components/root/NewPostForm'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/shadcn/ui/dialog'
import getPosts from '@/actions/data/getPosts'

import auth from '@/auth/auth'
import SearchablePosts from '@/components/SearchablePosts'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Page() {
  let posts = [];
  let error = null;
  try {
    const res = await auth.getCurrentUser()
    if (res.error) {
      redirect('/login')
    }
    const result = await getPosts()
    posts = result.posts
    error = result.error
    if (error) {
      // Check for Mongoose timeout error
      if (
        typeof error === 'string' &&
        error.includes('MongooseError: Operation `posts.find()` buffering timed out')
      ) {
        // Optionally clear cookies/session here if needed
        // For NextAuth, you can redirect to /api/auth/signout?callbackUrl=/login
        redirect('/api/auth/signout?callbackUrl=/login')
      }
      // Optionally log the error for debugging
      console.log(`Redirecting to login from page: ${error}`)
      // redirect('/login')
    }
  } catch (err: any) {
    // Check for Mongoose timeout error in catch block
    if (
      typeof err?.message === 'string' &&
      err.message.includes('MongooseError: Operation `posts.find()` buffering timed out')
    ) {
      redirect('/api/auth/signout?callbackUrl=/login')
    }
    // Optionally log the error for debugging
    console.log(`Redirecting to login from page: ${err}`)
    // redirect('/login')
  }
  return (
    <div className="flex w-full gap-5 overflow-hidden p-5 xl:p-7">
      <div className="flex w-full flex-col gap-5 rounded-2xl xl:p-3 xl:shadow-[0px_0px_2px_1px_#00000030]">
        {/* Search Input & Filtered Posts */}
          <h1 className="text-xl font-medium text-black/70">Active Requirements</h1>
        <SearchablePosts posts={posts} error={error ?? null} />

        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button >New Post</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <DialogTitle className='text-2xl font-semibold text-gray-800 p-3 text-center'>New Post</DialogTitle>
              <NewPostForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="hidden h-fit w-80 shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_2px_1px_#00000030] xl:block">
        <NewPostForm />
      </div>
    </div>
  )
}
