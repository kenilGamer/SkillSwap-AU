import { Button } from '@/components/Button'
import NewPostForm from '../../components/root/NewPostForm'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from '@/components/shadcn/ui/dialog'
import getPosts from '@/actions/data/getPosts'
import auth from '@/auth/auth'
import SearchablePosts from '@/components/SearchablePosts'
import { redirect } from 'next/navigation'
import { PlusIcon, RocketIcon } from '@radix-ui/react-icons'

export default async function Page() {
  let posts = [];
  let error = null;
  try {
    const res = await auth.getCurrentUser()
    if (res.error) {
      redirect('/login')
    }
    const result = await getPosts()
    posts = result.posts || []
    error = result.error
    if (error) {
      if (
        typeof error === 'string' &&
        error.includes('MongooseError: Operation `posts.find()` buffering timed out')
      ) {
        redirect('/api/auth/signout?callbackUrl=/login')
      }
      console.log(`Redirecting to login from page: ${error}`)
    }
  } catch (err: any) {
    if (
      typeof err?.message === 'string' &&
      err.message.includes('MongooseError: Operation `posts.find()` buffering timed out')
    ) {
      redirect('/api/auth/signout?callbackUrl=/login')
    }
    console.log(`Redirecting to login from page: ${err}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <RocketIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Active Requirements
                </h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Browse and manage your active requirements
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  aria-label="Create new post"
                >
                  <PlusIcon className="h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    Create New Post
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    Fill in the details below to create a new requirement post.
                  </DialogDescription>
                </DialogHeader>
                <NewPostForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Posts Section */}
            <div className="lg:col-span-2">
              <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                {posts.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 transition-colors group-hover:border-slate-300 dark:border-slate-800 dark:group-hover:border-slate-700">
                    <div className="text-center">
                      <RocketIcon className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        No posts found
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Create your first post to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  <SearchablePosts posts={posts} error={error ?? null} />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-8 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center gap-2">
                  <RocketIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    Quick Post
                  </h2>
                </div>
                <NewPostForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
