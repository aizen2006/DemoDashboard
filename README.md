<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LYNQ Analytics

**LYNQ Analytics** is a comprehensive Learning Management System (LMS) dashboard designed to bridge the gap between learner performance and administrative oversight. Built with a modern tech stack, it features a dual-role interface (User/Admin), real-time data visualization, and AI-powered strategic insights.

## 🚀 Features

### 🎓 Learner Workspace
- **Personal Dashboard**: Track Objective Scores, Engagement Rates, and Completion progress at a glance.
- **AI Insights Panel**: Powered by **Google Gemini**, providing qualitative analysis of learning patterns and bottlenecks.
- **Module Management**: Browse active courses, view completion status, and access learning materials.
- **Performance History**: Detailed history of quizzes, polls, and assessment scores.
- **Tweak Requests**: Submit content updates or bug reports directly to admins.

### 🛡️ Admin Workspace
- **System Overview**: Monitor total active users, pending requests, and system-wide module statistics.
- **User Management**: Manage user roles, view individual performance, and assign/unassign modules.
- **Module Manager**: Create, edit, and organize learning modules with status tracking (Draft/Active/Archived).
- **Request Handling**: Review and resolve tweak requests submitted by learners.

### 🎨 UI/UX
- **Dark Mode First**: A sleek, modern dark-themed interface using **Tailwind CSS v4**.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Smooth Animations**: Powered by **Motion** (formerly Framer Motion) for fluid page transitions and interactions.
- **Data Visualization**: Interactive charts and metrics built with **Recharts**.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini 2.5)
- **Routing**: [React Router](https://reactrouter.com/)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   git clone https://github.com/yourusername/lynq-analytics.git
   cd lynq-analytics
   2. **Install dependencies**
   npm install
   3. **Environment Setup**
   Create a `.env` file in the root directory and add your Gemini API key:
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   4. **Run the development server**
   npm run dev
      The application will be available at `http://localhost:3000` (or the port shown in your terminal).

## 📂 Project Structure

```
lynq-analytics/
├── components/          # Reusable UI components
│   ├── AI/              # AI-specific components (InsightsPanel)
│   └── UI/              # Generic UI elements (Cards, SidePanel, Background)
├── pages/               # Page views
│   ├── Admin/           # Admin-specific dashboards and managers
│   └── User/            # Learner-specific dashboards
├── services/            # API services (Gemini AI integration)
├── types.ts             # TypeScript interfaces and types
├── constants.ts         # Mock data and configuration constants
├── App.tsx              # Main Layout and Routing logic
└── index.css            # Global styles and Tailwind configuration
```

## 🧪 Usage

- **Role Switching**: Use the "Simulate Role Switch" button in the sidebar to instantly toggle between **User** (Client) and **Admin** views for demonstration purposes.
- **AI Analysis**: In the User Dashboard, click "Generate Analysis" to see Gemini analyze the mock metric data in real-time.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
