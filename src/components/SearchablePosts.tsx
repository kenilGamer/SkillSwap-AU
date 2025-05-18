'use client'

import { useState, useMemo } from 'react'
import RequirementCard, { IPropRequirementCard } from '@/components/root/RequirementCard'
import { IoSearchOutline } from 'react-icons/io5'

interface SearchablePostsProps {
  posts: IPropRequirementCard[]
  error: boolean | string | null
}

export default function SearchablePosts({ posts = [], error }: SearchablePostsProps) {
  const [query, setQuery] = useState('')

  // Filter posts based on query. Adjust filtering logic as needed.
  const filteredPosts = useMemo(() => {
    if (!query) return posts
    return posts.filter(post => {
      const desc = post.description || ''
      // If your posts have titles, skills, etc. you can include them in filtering
      const skills = post.requiredSkills ? post.requiredSkills.join(' ') : ''
      return (
        desc.toLowerCase().includes(query.toLowerCase()) ||
        skills.toLowerCase().includes(query.toLowerCase())
      )
    })
  }, [posts, query])

  return (
    <>
      <div className="flex sm:items-center md:min-w-[40%] max-sm:w-[72vw] mx-auto max-sm:absolute max-md:w-[70vw]">
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="max-sm:px-5 py-4 md:px-16 mt-2 outline-none text-zinc-200 rounded-full text-xl flex items-center mx-auto justify-center shadow-md shadow-[#000033]"
          type="search"
          name="search"
          placeholder="Search posts..."
        />
        <IoSearchOutline className="text-3xl md:mt-5 mt-8 text-zinc-400 -ml-16" />
      </div>
      <div className="no-scrollbar flex h-full w-full flex-col gap-5 overflow-auto">
        {error && <div>Something went wrong</div>}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((data, i) => (
            <RequirementCard key={i} data={data} />
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-medium text-black/60">
            There are no posts matching your search
          </div>
        )}
      </div>
    </>
  )
}
