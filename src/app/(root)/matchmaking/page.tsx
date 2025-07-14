'use client'

import getMatchedUser from '@/actions/data/getMatchedUser'
import { Button } from '@/components/Button'
import AddSkillTab from '@/components/root/AddSkillTab'
import { Badge } from '@/components/shadcn/ui/badge'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/ui/dialog'
import { Label } from '@/components/shadcn/ui/label'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import getDummyUsers, { pickRandom } from '@/helpers/getDummyUsers'
import userStore from '@/store/user.store'
import { useState } from 'react'
import { VscArrowSwap } from 'react-icons/vsc'
import { toast } from 'sonner'
import { useSnapshot } from 'valtio'

export default function Page() {
    const { user } = useSnapshot(userStore)
    const [requestMatchClicked, setRequestMatchClicked] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isFinding, setIsFinding] = useState(false)
    const [matchedSkills, setMatchedSkills] = useState(null as unknown as string[])
    const [matchedUser, setMatchedUser] = useState(null as null | ReturnType<typeof getDummyUsers>[0])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [setSkillSearchInput, setSetSkillSearchInput] = useState('')

    async function handleFindBuddy() {
        setIsFinding(true)
        const dummyUsers = getDummyUsers()
        const interval = setInterval(() => {
            setMatchedUser(pickRandom(dummyUsers) as { name: string; imageLink: string; chatLink: boolean; skills: string[]; } | null)
        }, 200)

        const res = await getMatchedUser(selectedSkills)
        if (res.error || !res.user) {
            toast.warning(res.error || 'No user was found', { position: 'top-center' })
        }
        clearInterval(interval)
        setMatchedUser(res.user)
        setMatchedSkills(res.user?.skills)
        setRequestMatchClicked(true)
        setIsFinding(false)
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="relative flex h-full w-full max-w-[1024px] flex-col items-center justify-center gap-10 rounded-2xl border bg-accent shadow-sm sm:gap-14 lg:max-h-[700px]">
                <h1 className="absolute left-0 top-0 mt-5 w-full text-center text-xl font-bold tracking-wide text-black/60">Find Your Buddy</h1>
                <div className="flex w-full items-center justify-center gap-5 sm:gap-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="aspect-square h-20 overflow-hidden rounded-full sm:h-24 md:h-32">
                            <img
                                className="h-full w-full"
                                src="/avatar/user1.png"
                                alt=""
                            />
                        </div>
                        <span className="text-sm font-medium text-black/80">{user.name}</span>
                    </div>
                    <VscArrowSwap className="text-4xl" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="aspect-square h-20 overflow-hidden rounded-full sm:h-24 md:h-32">
                            {matchedUser?.imageLink ? (
                                <img
                                    className="h-full w-full"
                                    src={matchedUser.imageLink}
                                    alt=""
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-300">???</div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-black/80">{matchedUser?.name || '???'}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <h2>Users Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills
                            ? matchedSkills.map((e, i) => (
                                  <Badge
                                      key={i}
                                      className="pointer-events-none bg-indigo-500 text-xs"
                                  >
                                      {e}
                                  </Badge>
                              ))
                            : [1, 2, 3].map((i) => (
                                  <Skeleton
                                      key={i}
                                      className="w-fit"
                                  >
                                      <Badge className="text-xs opacity-0">React</Badge>
                                  </Skeleton>
                              ))}
                    </div>
                </div>
                <div className="flex w-full flex-col items-center gap-3">
                    {requestMatchClicked && (
                        <Button
                            loading={isFinding}
                            variant="outline"
                            className="w-full max-w-52 border-2 border-slate-600"
                        >
                            Send Message
                        </Button>
                    )}
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(e) => setIsDialogOpen(e)}
                    >
                        <DialogTrigger asChild>
                            <Button
                                loading={isFinding}
                                className="w-full max-w-52"
                                onClick={() => {
                                    if (requestMatchClicked) {
                                        // e.preventDefault()
                                        // handleFindBuddy()
                                    }
                                }}
                            >
                                Request {requestMatchClicked ? 'Rematch' : 'Match'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-slate-700">Your Preference</DialogTitle>
                                <DialogDescription>We will search for your buddy based on your preference</DialogDescription>
                            </DialogHeader>
                            <Label>Skill</Label>
                            <AddSkillTab
                                selectedSkills={selectedSkills}
                                setSelectedSkills={setSelectedSkills}
                                setSkillSearchInput={setSetSkillSearchInput}
                                skillSearchInput={setSkillSearchInput}
                            />
                            <div className="flex gap-2">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full border-slate-600"
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button
                                    loading={isFinding}
                                    className="w-full"
                                    onClick={() => {
                                        handleFindBuddy()
                                        setIsDialogOpen(false)
                                    }}
                                >
                                    Find
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
