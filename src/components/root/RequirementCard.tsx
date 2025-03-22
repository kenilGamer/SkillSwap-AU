'use client'

import { Badge } from '@/components/shadcn/ui/badge'
import { Button } from '../Button'
import { IUser } from '@/models/user.model'
import { IPost } from '@/models/Post.model'
import { DateTime } from 'luxon'
import Link from 'next/link'
import callPromiseWithToast from '@/helpers/callPromiseWithToast'
import deleteMyPost from '@/actions/data/deleteMyPost'
import { useRouter } from 'next/navigation'

export interface IPropRequirementCard extends IPost {
  owner: IUser;
  createdAt: Date;
}
 
export default function RequirementCard({ data, myPost }: { data: IPropRequirementCard; myPost?: boolean }) {
  const router = useRouter()
 console.log(data);
 
  const handleChat = () => {
    // Navigate to the chat page.
    // You can pass the post ID or any other parameter as needed.
    router.push(`/chat?postId=${data._id}&sender=${data?.owner?._id}&receiver=${data?.owner?._id}`)

  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="aspect-square h-10 shrink-0 overflow-hidden rounded-full">
          {data.owner?.image ? (
            <img className="h-full w-full object-cover" src={data.owner.image} alt="" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-300">
              {data.owner?.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <Link
            href={`/profile/${data.owner?._id?.toString() || '#'}`}
            className="truncate font-medium text-black/70"
          >
            {data.owner?.name || "Unknown"}
          </Link>
          <span className="text-xs text-black/70">
            {DateTime.fromISO(data.createdAt.toString()).toFormat('hh:mm a | dd LLL yyyy')}
          </span>
        </div>
        {!myPost && (
          <Button className="ml-auto h-7 rounded-full text-xs" onClick={handleChat}>
            Chat
          </Button>
        )}
        {myPost && (
          <Button
            className="ml-auto h-7 rounded-full bg-red-400 text-xs hover:bg-red-400/80"
            onClick={async () => {
              const res = await callPromiseWithToast(deleteMyPost(data._id!))
              if (!res.error) router.refresh()
            }}
          >
            Delete
          </Button>
        )}
      </div>
      <p className='text-sm text-black/70'>{data.description || "No description provided"}</p>
      <div className="flex flex-col gap-2 rounded-xl bg-accent p-3">
        <h3 className="text-sm font-medium text-black/80">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.requiredSkills?.length ? (
            data.requiredSkills.map((name, i) => (
              <Badge key={i} className="pointer-events-none rounded-full bg-indigo-500 bg-gradient-to-tr">
                {name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-black/50">No skills listed</span>
          )}
        </div>
      </div>
    </div>
  )
}
