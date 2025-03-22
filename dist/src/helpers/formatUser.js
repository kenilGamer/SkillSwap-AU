"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatUser;
function formatUser(user) {
    return JSON.parse(JSON.stringify({ _id: user._id, name: user.name, email: user.email, username: user.username, country: user.country, website: user.website, skills: user.skills, bio: user.bio }));
}
