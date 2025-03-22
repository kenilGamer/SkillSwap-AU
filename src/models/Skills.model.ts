import mongoose, { Schema, Model } from 'mongoose'

// Type Definition for Skills Document

interface ISkills {
    skills: string[]
}

// Schema Definition for Skills

const skillsSchema: Schema = new Schema<ISkills>({
    skills: [
        {
            type: String,
        },
    ],
})

const Skills: Model<ISkills> = mongoose.models.Skill || mongoose.model('Skill', skillsSchema)

export default Skills
