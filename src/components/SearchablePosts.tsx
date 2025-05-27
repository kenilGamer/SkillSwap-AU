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
      const skills = post.requiredSkills ? post.requiredSkills.join(' ') : ''
      return (
        desc.toLowerCase().includes(query.toLowerCase()) ||
        skills.toLowerCase().includes(query.toLowerCase())
      )
    })
  }, [posts, query])

  return (
    <>
      <div className="relative flex items-center w-full max-w-xl mx-auto mb-6">
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base shadow focus:ring-2 focus:ring-indigo-200 transition-all outline-none pr-12"
          type="search"
          name="search"
          placeholder="Search posts..."
          aria-label="Search posts"
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition"
          aria-label="Search"
          tabIndex={-1}
          type="button"
        >
          <IoSearchOutline className="w-6 h-6" />
        </button>
      </div>
      <div className="no-scrollbar flex h-full w-full flex-col gap-5 overflow-auto">
        {error && (
          <div className="flex items-center justify-center text-base font-medium text-red-500 bg-red-50 rounded-lg p-4">
            Something went wrong. Please try again later.
          </div>
        )}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((data, i) => (
            <RequirementCard key={i} data={data} />
          ))
        ) : !error ? (
          <div className="flex h-40 w-full items-center justify-center text-lg font-medium text-slate-400 bg-slate-50 rounded-xl">
            <span>No posts match your search.</span>
          </div>
        ) : null}
      </div>
    </>
  )
}
