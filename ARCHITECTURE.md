# Nexus – Project Architecture Documentation

## Overview
Nexus is an Investor & Entrepreneur Collaboration Platform built with **React + TypeScript + Vite**, styled using **Tailwind CSS**, and deployed on **Vercel**.

## Tech Stack
- **Framework:** React 18 (with TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (custom design tokens)
- **Routing:** react-router-dom (BrowserRouter, Routes, Route)
- **Deployment:** Vercel

## Folder Structure

```
src/
├── components/
│   ├── chat/            # Chat-related UI components
│   ├── collaboration/   # Collaboration feature components
│   ├── entrepreneur/    # Entrepreneur-specific components
│   ├── investor/        # Investor-specific components
│   ├── layout/          # App shell: DashboardLayout, Navbar, Sidebar
│   └── ui/              # Reusable primitives: Avatar, Badge, Button, Card, Input
├── context/
│   └── AuthContext.tsx  # Authentication state & provider
├── data/                 # Mock/sample data used across the app
├── pages/
│   ├── auth/             # Login, Register pages
│   ├── chat/
│   ├── dashboard/        # EntrepreneurDashboard.tsx, InvestorDashboard.tsx
│   ├── deals/
│   ├── documents/
│   ├── entrepreneurs/
│   ├── help/
│   ├── investors/
│   ├── messages/
│   ├── notifications/
│   ├── profile/          # EntrepreneurProfile.tsx, InvestorProfile.tsx
│   └── settings/
├── types/                 # Shared TypeScript types/interfaces
├── App.tsx                # Root component: routing + providers
├── main.tsx                # App entry point
└── index.css               # Global styles (Tailwind directives)
```

## Architecture Pattern
The app follows a **role-based dashboard architecture**:
- Two primary user roles: **Investor** and **Entrepreneur**
- Each role has its own dashboard (`InvestorDashboard.tsx`, `EntrepreneurDashboard.tsx`) and profile page
- Shared layout (`DashboardLayout`, `Navbar`, `Sidebar`) wraps all authenticated pages
- Authentication state is managed globally via `AuthContext` (React Context API)
- Reusable UI primitives (`Button`, `Card`, `Input`, `Avatar`, `Badge`) live in `components/ui` and are used consistently across the app to keep the UI unified

## Component Hierarchy (simplified)

```
main.tsx
 └── App.tsx
      ├── AuthProvider (context)
      └── Router
           ├── /login, /register        → pages/auth
           └── DashboardLayout
                ├── Navbar
                ├── Sidebar
                └── Routed Pages
                     ├── /dashboard      → Investor/EntrepreneurDashboard
                     ├── /deals
                     ├── /documents
                     ├── /chat
                     ├── /messages
                     ├── /notifications
                     ├── /profile
                     └── /settings
```

## Design System / Theme
Defined in `tailwind.config.js`:

| Token       | Purpose                          |
|-------------|-----------------------------------|
| `primary`   | Blue — main brand/action color   |
| `secondary` | Teal — secondary actions          |
| `accent`    | Amber — highlights/CTAs           |
| `success`   | Green — success states            |
| `warning`   | Amber/orange — warning states      |
| `error`     | Red — error states                 |

- **Font:** `Inter var` (sans-serif)
- **Animations:** `fade-in`, `slide-in` custom keyframes for smooth transitions
- All UI components (e.g. `Button.tsx`) consume these tokens via Tailwind utility classes (`bg-primary-600`, `text-secondary-700`, etc.), ensuring a consistent look across the app.

## Notes for New Contributors
- No new component library is being introduced — extend using existing `components/ui` primitives wherever possible for visual consistency.
- New feature folders (e.g. a future `meetings` page) should follow the same pattern as existing ones in `src/pages/`.
- Role-based logic should check the user's role from `AuthContext` and conditionally render Investor vs Entrepreneur views, following the existing dashboard pattern.
