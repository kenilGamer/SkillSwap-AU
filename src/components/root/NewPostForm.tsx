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

export default function NewPostForm() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [skillSearchInput, setSkillSearchInput] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<any>({})
    const router = useRouter()

    async function onSubmit() {
        const validate = postValidation.safeParse({ requiredSkills: selectedSkills, description })
        if (!validate.success) return setError(validate.error.formErrors.fieldErrors)
        setError({})
    
        const res = await callPromiseWithToast(postRequirement({ requiredSkills: selectedSkills, description }))
        if (res.success) {
            setSelectedSkills([])
            setSkillSearchInput('')
            setDescription('')
            router.refresh()
        }
    }

    return (
        <div className="flex w-full flex-col gap-3 p-5">
            <h2 className="text-lg font-medium text-black/70">Post your Requirement</h2>
            <div className="space-y-1">
                <div className="flex flex-col gap-1">
                    <Label>Skills</Label>
                    {error?.requiredSkills && <span className="text-xs text-red-500">{error?.requiredSkills}</span>}
                </div>
                <AddSkillTab
                    skillSearchInput={skillSearchInput}
                    setSkillSearchInput={setSkillSearchInput}
                    setSelectedSkills={setSelectedSkills}
                    selectedSkills={selectedSkills}
                />
            </div>
            <div className="space-y-2">
                <div className="flex flex-col gap-1">
                    <Label>Description</Label>
                    {error?.description && <span className="text-xs text-red-500">{error?.description}</span>}
                </div>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-40 resize-none rounded-lg border-slate-300"
                    placeholder="I want a slave"
                />
            </div>
            <Button
                onClick={onSubmit}
                className="mt-3 h-0 rounded-full py-4"
            >
                Post
            </Button>
        </div>
    )
}
