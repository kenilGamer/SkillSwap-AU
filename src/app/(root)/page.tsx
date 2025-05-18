import { Button } from '@/components/Button'
import RequirementCard, { IPropRequirementCard } from '@/components/root/RequirementCard'
import NewPostForm from '../../components/root/NewPostForm'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/shadcn/ui/dialog'
import getPosts from '@/actions/data/getPosts'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import auth from '@/auth/auth'
import SearchablePosts from '@/components/SearchablePosts'


export default async function Page() {
  let posts = [];
  let error = null;
  try {
    const res = await auth.getCurrentUser()
    if (res.error) {
      alert(`Redirecting to login from page: ${res.error}`)
      redirect('/login')
    }
    const result = await getPosts()
    console.log(result)
    posts = result.posts
    error = result.error
    if (error) {
      alert(`Redirecting to login from page: ${error}`)
      redirect('/signin')
    }
  } catch (err) {
    alert(`Redirecting to login from page: ${err}`)
    redirect('/signin')
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
              <Button>New Post</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <DialogTitle>New Post</DialogTitle>
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
