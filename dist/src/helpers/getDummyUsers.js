"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = pickRandom;
exports.default = getDummyUsers;
function pickRandom(val, roundOff) {
    switch (typeof val) {
        case 'object':
            if (Array.isArray(val)) {
                return val[Math.floor(Math.random() * val.length)];
            }
            else {
                let keysArr = Object.keys(val);
                let prop = keysArr[Math.floor(Math.random() * keysArr.length)];
                return { [prop]: val[prop] };
            }
        case 'number':
            if (!roundOff) {
                return Math.floor(Math.random() * val);
            }
            else {
                return Math.random() * val;
            }
        case 'string':
            return val[Math.floor(Math.random() * val.length)];
        default:
            return console.error('Invalid input provided cannot randomize');
    }
}
//makes dummy data for testing purposes with array of 10 users
function getDummyUsers() {
    const dummynames = ['onion', 'potato', 'cheese', 'hamster', 'wolf', 'user', 'kenil', 'lion', 'monkey'];
    const dummyUserSkills = [['React', 'Angular', 'Vue'], ['C++', 'Java', 'Express', 'C#'], ['React'], ['C++', 'Java', 'Express', 'C#', 'DSA']];
    return new Array(9).fill(0).map((_, i) => ({
        name: pickRandom(dummynames),
        imageLink: ('/avatar/user' + (i + 1) + '.png'),
        chatLink: true,
        skills: pickRandom(dummyUserSkills),
    }));
}
