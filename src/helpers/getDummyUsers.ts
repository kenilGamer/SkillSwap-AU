export function pickRandom(val: any, roundOff?: boolean) {
    switch (typeof val) {
        case 'object':
            if (Array.isArray(val)) {
                return val[Math.floor(Math.random() * val.length)]
            } else {
                const keysArr = Object.keys(val)
                const prop = keysArr[Math.floor(Math.random() * keysArr.length)]
                return { [prop]: val[prop] }
            }
        case 'number':
            if (!roundOff) {
                return Math.floor(Math.random() * val)
            } else {
                return Math.random() * val
            }
        case 'string':
            return val[Math.floor(Math.random() * val.length)]

        default:
            return console.error('Invalid input provided cannot randomize')
    }
}

//makes dummy data for testing purposes with array of 10 users
export default function getDummyUsers() {
    const dummynames = ['onion', 'potato', 'cheese', 'hamster', 'wolf', 'user', 'kenil', 'lion', 'monkey']
    const dummyUserSkills = [['React', 'Angular', 'Vue'], ['C++', 'Java', 'Express', 'C#'], ['React'], ['C++', 'Java', 'Express', 'C#', 'DSA']]

    return new Array(9).fill(0).map((_, i) => ({
        name: pickRandom(dummynames) as string,
        imageLink: ('/avatar/user' + (i + 1) + '.png') as string,
        chatLink: true,
        skills: pickRandom(dummyUserSkills) as string[],
    }))
}
