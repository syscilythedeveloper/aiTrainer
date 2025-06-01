myTrAIner+ is a web application that uses an AI agent to generate custom workout and diet plans based on a conversation with the user. Users receive a personalized workout plan, diet plan, and a grocery list for the week. The app also allows users to track their workout progress and view previous plans.

##Features
Conversational AI: Chat with an AI agent to generate a personalized fitness plan.
Custom Workout Plans: Receive weekly workout routines tailored to your goals and fitness level.
Diet Plans & Grocery Lists: Get a diet plan and a grocery list for the week.
Progress Tracking: Mark workouts as complete and track your progress visually.
History: View and revisit previous fitness plans.
Authentication: Secure login and user management with Clerk.
##Tech Stack
Frontend: Next.js (React 19)
Backend/Database: Convex
AI/Voice: Vapi, @google/genai
Authentication: Clerk
UI: Tailwind CSS, Radix UI, Lucide Icons, React Icons
Other: ESLint, TypeScript

##Getting Started
Prerequisites
Node.js (v18+ recommended)
npm or yarn
Installation

1. Clone the repository:
   git clone https://github.com/yourusername/ai_trainer.git
   cd ai_trainer
2. Install Dependencies
   npm install

# or

yarn install 3. Set up environment variables:

# Clerk (Authentication)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-frontend-api-url

# Vapi (AI Voice Agent)

NEXT_PUBLIC_ASSISTANT_ID=your_vapi_assistant_id
NEXT_PRIVATE_VAPI_API_KEY=your_vapi_private_api_key
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_api_key

# Convex (Database/Backend)

CONVEX_DEPLOYMENT=dev:your-convex-deployment-slug
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Google Gemini (AI)

GEMINI_API_KEY=your_google_gemini_api_key

Copy .env.example to .env.local and fill in the required values for Clerk, Convex, Vapi, and any other services.

4. Configure Next.js image domains:

Make sure your next.config.js includes any external image domains (e.g., img.clerk.com).

5. Run the development server:
   npm run dev

# or

yarn dev

6. Open http://localhost:3000 in your browser.

Scripts
npm run dev — Start the development server
npm run build — Build for production
npm start — Start the production server
npm run lint — Run ESLint
Configuration
Convex: Used for backend data and real-time updates.
Clerk: Handles authentication and user management.
Vapi: Provides conversational AI and voice features.
Google GenAI: Used for AI-powered plan generation.
