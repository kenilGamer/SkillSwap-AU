# SkillSwap

A platform for developers to connect, share knowledge, and collaborate on projects.

## Features

- 🔐 **Authentication**
  - Email/Password login
  - Google OAuth integration
  - Secure session management with NextAuth.js
  - JWT-based authentication

- 👤 **User Profiles**
  - Customizable user profiles
  - Profile picture support
  - Skills management
  - Bio and personal information

- 🤝 **Matchmaking**
  - Find developers with complementary skills
  - Connect with potential collaborators
  - Skill-based matching system

- 💬 **Chat System**
  - Real-time messaging
  - Direct communication between users
  - Chat history

- 📚 **Resources**
  - Learning materials
  - Code snippets
  - Development resources

- 👨‍🏫 **Mentorship**
  - Find mentors
  - Become a mentor
  - Structured mentorship programs

- 💭 **Forum**
  - Community discussions
  - Q&A platform
  - Knowledge sharing

## Tech Stack

- **Frontend**
  - Next.js 14
  - React
  - Tailwind CSS
  - Framer Motion
  - Shadcn UI Components

- **Backend**
  - Next.js API Routes
  - MongoDB
  - Mongoose
  - NextAuth.js

- **Authentication**
  - NextAuth.js
  - JWT
  - Google OAuth
  - Argon2 password hashing

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/SkillSwap.git
cd SkillSwap
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (root)/            # Root layout and pages
│   ├── api/               # API routes
│   └── auth/              # Authentication routes
├── components/            # React components
├── models/               # Mongoose models
├── actions/              # Server actions
├── helpers/              # Utility functions
└── validations/          # Data validation schemas
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication
- Shadcn UI for the beautiful components
- The open-source community for inspiration and support
