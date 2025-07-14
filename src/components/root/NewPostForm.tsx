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
import { FaCode, FaDatabase, FaQuestion } from 'react-icons/fa'
import { MdDescription } from 'react-icons/md'
import { BiCategory } from 'react-icons/bi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface FormErrors {
  requiredSkills?: string[];
  description?: string[];
  category?: string[];
}

export default function NewPostForm() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchInput, setSkillSearchInput] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<FormErrors>({})
  const [category, setCategory] = useState('Select Category')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function onSubmit() {
    setIsSubmitting(true)
    try {
      const validate = postValidation.safeParse({ requiredSkills: selectedSkills, description, category })
      if (!validate.success) {
        setError(validate.error.formErrors.fieldErrors)
        return
      }
      setError({})
     
      const res = await callPromiseWithToast(postRequirement({ requiredSkills: selectedSkills, description, category }))
  
      if (res.success) {
        setSelectedSkills([])
        setSkillSearchInput('')
        setDescription('')
        setCategory('Select Category')
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <FaCode className="text-indigo-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Post Your Requirement</h2>
      </div>
      
      {/* Skills Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 font-medium">Required Skills</Label>
          {error?.requiredSkills && <span className="text-sm text-red-500">{error.requiredSkills}</span>}
        </div>
        <AddSkillTab
          skillSearchInput={skillSearchInput}
          setSkillSearchInput={setSkillSearchInput}
          setSelectedSkills={setSelectedSkills}
          selectedSkills={selectedSkills}
        />
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdDescription className="text-gray-600" />
            <Label className="text-gray-700 font-medium">Description</Label>
          </div>
          {error?.description && <span className="text-sm text-red-500">{error.description}</span>}
        </div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-32 resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          placeholder="Describe your requirement in detail..."
        />
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BiCategory className="text-gray-600" />
          <Label className="text-gray-700 font-medium">Category</Label>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild value={category}>
            <button className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-indigo-500 transition-all duration-200 flex items-center justify-between">
              <span className="text-gray-700">{category}</span>
              <span className="text-gray-400">▼</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-white rounded-lg shadow-xl p-1 z-[1000] border border-gray-100"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer rounded-md flex items-center gap-2 text-gray-700"
                onSelect={() => setCategory('Database Problem')}
              >
                <FaDatabase className="text-indigo-600" />
                Database Problem
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer rounded-md flex items-center gap-2 text-gray-700"
                onSelect={() => setCategory('Coding Problem')}
              >
                <FaCode className="text-indigo-600" />
                Coding Problem
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer rounded-md flex items-center gap-2 text-gray-700"
                onSelect={() => setCategory('Doubt')}
              >
                <FaQuestion className="text-indigo-600" />
                Doubt
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className={`mt-4 w-full px-8 py-3.5 bg-indigo-600 font-semibold text-md hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 text-white rounded-xl flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin" />
            Posting...
          </>
        ) : (
          'Post Requirement'
        )}
      </Button>
    </div>
  )
}
