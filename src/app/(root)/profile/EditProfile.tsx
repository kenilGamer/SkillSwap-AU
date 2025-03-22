import { Button } from '@/components/Button'
import AddSkillTab from '@/components/root/AddSkillTab'
import { DialogClose } from '@/components/shadcn/ui/dialog'
import { Input } from '@/components/shadcn/ui/input'
import { Label } from '@/components/shadcn/ui/label'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { IUser } from '@/models/user.model'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select'
import countries from '@/constants/countries'
import { userValidation } from '@/validations/user.validation'
import updateProfile from '@/actions/user/data/updateProfile'
import callPromiseWithToast from '@/helpers/callPromiseWithToast'
import { Dialog, DialogContent, DialogTrigger } from '@/components/shadcn/ui/dialog'
import userStore from '@/store/user.store'

export default function EditProfile({ user }: { user: IUser }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedSkills, setSelectedSkills] = useState<string[]>(user.skills as string[])
    const [skillSearchInput, setSkillSearchInput] = useState('')
    const [name, setName] = useState(user.name)
    const [username, setUsername] = useState(user.username)
    const [country, setCountry] = useState(user.country || '')
    const [website, setWebsite] = useState(user.website || '')
    const [bio, setBio] = useState(user.bio)
    const [error, setError] = useState<any>({})

    async function onSubmit() {
        const validate = userValidation.safeParse({ name, username, country, website, bio, skills: selectedSkills })
        if (!validate.success) {
            console.log(validate.error.formErrors)
            return setError(validate.error.formErrors.fieldErrors)
        }
        setError({})
        setLoading(true)
        const res = await callPromiseWithToast(updateProfile(validate.data))
        if (res.success) {
            setIsDialogOpen(false)
            userStore.setUser(res.user)
        }
        setLoading(false)
    }

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen max-w-2xl overflow-auto p-0">
                <div className="flex flex-col gap-5 p-5">
                    <h2 className="text-lg font-bold ">Edit Your Profile</h2>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Label>Name</Label>
                            {error?.name && <span className="text-xs text-red-500">{error?.name[0]}</span>}
                        </div>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Input>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Label>Username</Label>
                            {error?.username && <span className="text-xs text-red-500">{error?.username[0]}</span>}
                        </div>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></Input>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex w-full flex-col gap-3">
                            <Label>Country</Label>
                            <Select
                                value={country}
                                onValueChange={(e) => setCountry(e)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={'Select A Country'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((e, i) => (
                                        <SelectItem
                                            key={i}
                                            value={e}
                                        >
                                            {e}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-full flex-col gap-3">
                            <Label>Website</Label>
                            <Input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="url"
                            ></Input>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Skills</Label>
                        <AddSkillTab
                            skillSearchInput={skillSearchInput}
                            setSkillSearchInput={setSkillSearchInput}
                            selectedSkills={selectedSkills}
                            setSelectedSkills={setSelectedSkills}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>About Me</Label>
                        <Textarea
                            className="h-32 resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <DialogClose className="ml-auto">
                            <Button variant="secondary">Close</Button>
                        </DialogClose>
                        <Button
                            loading={loading}
                            onClick={onSubmit}
                        >
                            Update Profile
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
