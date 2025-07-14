'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Input } from '../shadcn/ui/input'
import { FaCheck } from 'react-icons/fa'
import { Badge } from '../shadcn/ui/badge'
import { IoClose } from 'react-icons/io5'
import MiniSearch from 'minisearch'
import skills from '@/constants/skills'

interface IProp {
    selectedSkills: string[]
    setSelectedSkills: Dispatch<SetStateAction<string[]>>
    skillSearchInput: string
    setSkillSearchInput: Dispatch<SetStateAction<string>>
}

export default function AddSkillTab({ selectedSkills, setSelectedSkills, skillSearchInput, setSkillSearchInput }: IProp) {
    const [skillDropdownOpen, setSkillDropdownOpen] = useState(false)
    const skillsTab = useRef<HTMLDivElement>(null)

    function removeSkill(name: string) {
        setSelectedSkills((prev) => prev.filter((e) => e !== name))
    }

    function addSkill(name: string) {
        if (selectedSkills.includes(name)) removeSkill(name)
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        else setSelectedSkills((prev) => [...prev, name])
    }

    function hideSkillsTab(e: MouseEvent) {
        if (!skillsTab.current?.contains(e.target as Node)) {
            setSkillDropdownOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', hideSkillsTab)
        return () => document.removeEventListener('click', hideSkillsTab)
    }, [])

    const miniSearch = new MiniSearch({
        fields: ['text'],
        storeFields: ['text'],
        searchOptions: {
            fuzzy: true,
            prefix: true,
        },
    })
    miniSearch.addAll(skills)

    return (
        <>
            <div className="flex flex-wrap gap-2 py-2">
                {selectedSkills.map((name, i) => (
                    <Badge
                        className="gap-1 rounded-full bg-indigo-500 pr-1.5 hover:bg-indigo-500"
                        key={i}
                    >
                        <span>{name}</span>
                        <IoClose
                            onClick={() => removeSkill(name)}
                            className="pointer-events-auto cursor-pointer"
                        />
                    </Badge>
                ))}
                {!selectedSkills.length && <span className="text-sm text-black/80">You have&apos;t added any skills</span>}
            </div>
            <div
                ref={skillsTab}
                className="relative"
            >
                <Input
                    value={skillSearchInput}
                    onChange={(e) => setSkillSearchInput(e.target.value)}
                    placeholder="Add new skill"
                    onFocus={() => setSkillDropdownOpen(true)}
                />
                {skillDropdownOpen && (
                    <div className="absolute top-10 h-32 w-full overflow-auto rounded-md bg-white p-2 text-sm shadow-lg">
                        {(skillSearchInput ? miniSearch.search(skillSearchInput) : skills).map(({ text }: { text: string }, i) => (
                            <div
                                onClick={() => addSkill(text)}
                                key={i}
                                className="flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-slate-100"
                            >
                                <FaCheck className={`text-xs text-slate-600 ${!selectedSkills.includes(text) && 'opacity-0'}`} />
                                {text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
