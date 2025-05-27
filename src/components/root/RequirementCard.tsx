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
  const handleChat = () => {
    router.push(`/chat?postId=${data._id}&sender=${data?.owner?._id}&receiver=${data?.owner?._id}`)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-200 text-lg font-bold text-blue-700 shadow-sm">
          {data.owner?.image ? (
            <img className="h-full w-full object-cover rounded-full" src={data.owner.image} alt={data.owner?.name || ''} />
          ) : (
            <span>{data.owner?.name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <Link
            href={`/profile/${data.owner?._id?.toString() || '#'}`}
            className="truncate font-semibold text-slate-800 hover:underline"
          >
            {data.owner?.name || 'Unknown'}
          </Link>
          <span className="text-xs text-slate-400">
            {DateTime.fromISO(data.createdAt.toString()).toFormat('hh:mm a | dd LLL yyyy')}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!myPost && (
            <Button
              className="rounded-full bg-indigo-500 px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all"
              onClick={handleChat}
            >
              Chat
            </Button>
          )}
          {myPost && (
            <Button
              className="rounded-full bg-red-400 px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-500 focus:ring-2 focus:ring-red-300 transition-all"
              onClick={async () => {
                const res = await callPromiseWithToast(deleteMyPost(data._id!))
                if (!res.error) router.refresh()
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <div className="text-base text-slate-700 break-words whitespace-pre-line min-h-[24px]">
        {data.description || 'No description provided'}
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.requiredSkills?.length ? (
            data.requiredSkills.map((name, i) => (
              <Badge key={i} className="pointer-events-none rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium shadow-sm">
                {name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-slate-400">No skills listed</span>
          )}
        </div>
      </div>
    </div>
  )
}
