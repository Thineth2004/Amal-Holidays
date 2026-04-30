# Amal-Holidays Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive B2C frontend using React (TypeScript) and HeroUI, integrated with the existing Express backend.

**Architecture:** Component-based UI with client-side routing, state management (e.g., React Query or Context), and API communication via Axios.

**Tech Stack:** React, TypeScript, HeroUI v3 (Beta), Tailwind CSS v4, Axios, React Router.

---

### Task 1: Setup and Foundation

**Files:**
- Create: `package.json` (frontend)
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/router.tsx`

- [ ] **Step 1: Initialize Vite Project**
Run: `npm create vite@latest frontend -- --template react-ts`
- [ ] **Step 2: Install Dependencies**
Run: `npm install @heroui/react framer-motion tailwindcss @tailwindcss/vite axios react-router-dom`
- [ ] **Step 3: Configure Tailwind CSS v4**
Update `vite.config.ts` to include `@tailwindcss/vite` plugin.
- [ ] **Step 4: Setup Router**
Define routes for `/`, `/destinations`, `/packages`, `/package/:id`, `/login`, `/dashboard`, `/admin/*`.

---

### Task 2: Authentication System

**Files:**
- Create: `src/services/authService.ts`
- Create: `src/components/LoginForm.tsx`
- Create: `src/context/AuthContext.tsx`

- [ ] **Step 1: Auth Context**
Implement context to hold `user` state and `token`.
- [ ] **Step 2: Login Form**
Implement form using HeroUI `Input` and `Button` components. Call `/api/auth/login`.
- [ ] **Step 3: Protected Route Wrapper**
Implement `ProtectedRoute` component to redirect unauthenticated users to `/login`.

---

### Task 3: Tourist Portal (Public & Auth Flow)

**Files:**
- Create: `src/pages/LandingPage.tsx`
- Create: `src/pages/PackageListing.tsx`
- Create: `src/pages/PackageDetails.tsx`

- [ ] **Step 1: Landing Page**
Hero section + Search Bar (using HeroUI `Input` and `Button`).
- [ ] **Step 2: Package Grid**
Fetch available packages from `/api/packages/available`. Map to HeroUI `Card` components.
- [ ] **Step 3: Package Details Page**
Display detailed info. "Book Now" button calls `/api/bookings`.

---

### Task 4: Admin/Manager Dashboard

**Files:**
- Create: `src/pages/admin/AdminDashboard.tsx`
- Create: `src/pages/admin/PackageManagement.tsx`

- [ ] **Step 1: Dashboard Layout**
Sidebar navigation + Main Content area.
- [ ] **Step 2: Package Management Table**
Fetch all packages `/api/packages/all`. Use HeroUI `Table`. Add "Create/Edit/Delete" buttons.
- [ ] **Step 3: CRUD Modals**
Implement HeroUI `Modal` for creating/editing packages.

---

### Task 5: Integration & Polish

- [ ] **Step 1: Integrate API calls**
Replace hardcoded data with actual Axios calls to the backend.
- [ ] **Step 2: Role-based UI**
Apply conditional rendering logic based on `authContext.user.role`.
- [ ] **Step 3: Final Styling**
Ensure layout consistency using HeroUI design tokens.
