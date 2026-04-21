# AI Assistant Portfolio

An interactive portfolio showcasing an AI assistant built with modern web technologies. This application features a beautiful UI with real-time AI-powered chat capabilities and smooth animations.

## 🚀 Features

- **Interactive Chat Interface**: Real-time conversation with an AI assistant powered by OpenAI
- **Responsive Design**: Beautiful, modern UI that works seamlessly across all devices
- **Smooth Animations**: Elegant transitions and animations using Framer Motion
- **Dark Mode Support**: Built-in theme switching with next-themes
- **API Integration**: Backend API route for handling AI chat requests
- **Component-Based Architecture**: Reusable UI components with Radix UI

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16.1.1 (React 19.2.3)
- **AI/ML**: Vercel AI SDK, OpenAI, LangChain
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide React
- **Utilities**: TypeScript, ESLint

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun package manager
- OpenAI API key (for AI features)

## ⚡ Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
├── app/
│   ├── api/chat/          # AI chat API endpoint
│   ├── chat/              # Chat page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── chat.tsx          # Chat component
│   ├── hero-section.tsx  # Hero section
│   └── ui/               # UI component library
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/              # Global styles
```

## 🔧 Configuration

The application uses the following configuration files:

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration (via components.json)
- `eslint.config.mjs` - ESLint configuration

## 🚀 Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

1. Push your code to a GitHub repository
2. Import your repository on Vercel
3. Set required environment variables
4. Deploy with one click

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [OpenAI API](https://platform.openai.com/)
- [LangChain Documentation](https://js.langchain.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

This project is private and maintained by Akshay Maru.

---

**Built with ❤️ by Akshay Maru**
