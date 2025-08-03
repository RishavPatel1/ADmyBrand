📊 ADmyBRAND Insights - Analytics Dashboard
A modern, visually stunning analytics dashboard built for digital marketing agencies. Features beautiful glassmorphism design, interactive charts, and comprehensive campaign tracking.
Show Image
🎨 Design Features
Visual Excellence

Glassmorphism Design - Backdrop blur effects with translucent cards
Dark/Light Mode - Complete theme system with smooth transitions
Gradient Branding - Multi-color gradients (blue→purple→pink)
Smooth Animations - Staggered loading, hover effects, micro-interactions
Responsive Design - Mobile-first approach, perfect on all devices

Modern UI Components

Interactive metric cards with animated progress bars
Dynamic chart switching (Line, Area, Bar)
Enhanced pie chart with trend indicators
Professional data table with advanced features
Beautiful loading states and skeletons

🚀 Features
📈 Analytics Overview

Key Metrics Cards: Revenue, Users, Conversions, Growth Rate
Interactive Charts:

Line Chart: Revenue trends over time
Area Chart: Filled area visualization
Bar Chart: Daily conversions
Pie Chart: Traffic sources breakdown



📋 Campaign Management

Advanced Data Table with:

Real-time search and filtering
Column sorting (ascending/descending)
Pagination with page navigation
Status indicators and performance color coding



⚡ Real-time Features

Live clock in header
Status indicators with pulsing animations
Export functionality (ready for PDF/CSV)
Smooth theme switching

🛠️ Tech Stack

Framework: Next.js 14+ with App Router
Frontend: React 18+ with TypeScript
Styling: Tailwind CSS with custom animations
Charts: Recharts library
Icons: Lucide React
Deployment: Optimized for Vercel/Netlify

📦 Installation
bash# Clone the repository
git clone https://github.com/yourusername/admybrand-insights-dashboard.git
cd admybrand-insights-dashboard

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build
🚀 Deployment
Vercel (Recommended)
bash# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment to production
vercel --prod
Netlify
bash# Build the project
npm run build

# Deploy to Netlify (drag & drop the 'out' folder)
Manual Deployment
bash# Build static files
npm run build

# The 'out' folder contains all static files ready for deployment
📁 Project Structure
admybrand-insights-dashboard/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   └── Dashboard.tsx        # Main dashboard component
├── public/
│   └── favicon.ico          # Favicon
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── next.config.js           # Next.js configuration
└── README.md                # This file
🎯 Key Components
MetricCard
Reusable component for displaying key metrics with:

Hover animations and transformations
Gradient progress bars
Icon integration
Trend indicators

ChartCard
Wrapper component for all charts with:

Consistent header layout
Icon and subtitle support
Hover effects
Action menu integration

Dashboard
Main component orchestrating:

State management for all features
Data processing and filtering
Theme switching logic
Responsive layout handling

🎨 Design System
Colors

Primary: Blue (#3B82F6) to Purple (#8B5CF6) gradients
Success: Green (#10B981)
Warning: Yellow (#F59E0B)
Error: Red (#EF4444)
Neutral: Gray scale with dark mode support

Typography

Font: Inter (Google Fonts)
Headings: Bold with gradient text effects
Body: Regular with proper contrast ratios
Captions: Muted colors for secondary information

Spacing

Grid: 16px base unit
Components: Consistent padding and margins
Responsive: Adaptive spacing for


Grid: 16px base unit
Components: Consistent padding and margins
Responsive: Adaptive spacing for
