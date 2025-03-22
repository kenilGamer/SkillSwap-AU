import { Button } from '@/components/Button'
import RequirementCard, { IPropRequirementCard } from '@/components/root/RequirementCard'
import NewPostForm from '../../components/root/NewPostForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/shadcn/ui/dialog'
import getPosts from '@/actions/data/getPosts'
import SearchablePosts from '@/components/SearchablePosts'  

export default async function Page() {
  const { posts, error } = await getPosts() // posts should be serializable

  return (
    <div className="flex w-full gap-5 overflow-hidden p-5 xl:p-7">
      <div className="flex w-full flex-col gap-5 rounded-2xl xl:p-3 xl:shadow-[0px_0px_2px_1px_#00000030]">
        {/* Search Input & Filtered Posts */}
          <h1 className="text-xl font-medium text-black/70">Active Requirements</h1>
        <SearchablePosts posts={posts} error={error} />

        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-auto flex h-7 rounded-full xl:hidden">New Post</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <NewPostForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* If you want to show posts again below or similar */}
        {/* <div className="no-scrollbar flex h-full w-full flex-col gap-5 overflow-auto">
          {error && <div>Something went wrong</div>}
          {posts?.length ? (
              posts.map((data: IPropRequirementCard, i: number) => (
                  <RequirementCard key={i} data={data} />
              ))
          ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-medium text-black/60">
                  There is no available posts
              </div>
          )}
        </div> */}
      </div>
      <div className="hidden h-fit w-80 shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_2px_1px_#00000030] xl:block">
        <NewPostForm />
      </div>
    </div>
  )
}
