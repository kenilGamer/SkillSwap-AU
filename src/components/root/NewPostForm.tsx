'use client'

import { Label } from '@/components/shadcn/ui/label'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { Button } from '@/components/Button'
import { useState } from 'react'
import postRequirement from '@/actions/post/postRequirement'
import { postValidation } from '@/validations/post.validation'
import callPromiseWithToast from '@/helpers/callPromiseWithToast'
import { useRouter } from 'next/navigation'
import AddSkillTab from './AddSkillTab'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export default function NewPostForm() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchInput, setSkillSearchInput] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<any>({})
  const [category, setCategory] = useState('Select Category')
  const router = useRouter()

  async function onSubmit() {
    // Include category if needed in your postRequirement call
    const validate = postValidation.safeParse({ requiredSkills: selectedSkills, description, category })
    if (!validate.success) return setError(validate.error.formErrors.fieldErrors)
    setError({})
   
    const res = await callPromiseWithToast(postRequirement({ requiredSkills: selectedSkills, description, category }))

    if (res.success) {
      setSelectedSkills([])
      setSkillSearchInput('')
      setDescription('')
      setCategory('Select Category')
      router.refresh()
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md flex flex-col gap-5">
      <h2 className="text-2xl font-semibold text-gray-800">Post Your Requirement</h2>
      
      {/* Skills Section */}
      <div className="space-y-1">
        <div>
          <Label>Skills</Label>
          {error?.requiredSkills && <span className="text-xs text-red-500">{error.requiredSkills}</span>}
        </div>
        <AddSkillTab
          skillSearchInput={skillSearchInput}
          setSkillSearchInput={setSkillSearchInput}
          setSelectedSkills={setSelectedSkills}
          selectedSkills={selectedSkills}
        />
      </div>

      {/* Description Section */}
      <div className="space-y-1">
        <div>
          <Label>Description</Label>
          {error?.description && <span className="text-xs text-red-500">{error.description}</span>}
        </div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-32 resize-none rounded-lg border border-gray-300 p-2"
          placeholder="Describe your requirement..."
        />
      </div>

      {/* Category Dropdown */}
      <div className="space-y-1">
        <Label>Category</Label>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild value={category}>
            <button className="mt-2 w-full px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              {category}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-white rounded-md shadow-md p-2 z-[1000]"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onSelect={() => setCategory('Database Problem')}
              >
                Database Problem
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onSelect={() => setCategory('Coding Problem')}
              >
                Coding Problem
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onSelect={() => setCategory('Doubt')}
              >
                Doubt
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        className="mt-4 w-full px-8 py-3 bg-black font-semibold text-md hover:scale-105 transition-all duration-300 text-white rounded-full"
      >
        Post Requirement
      </Button>
    </div>
  )
}
