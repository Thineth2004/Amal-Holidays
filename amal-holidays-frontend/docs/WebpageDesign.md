# Webpage Design Specification: Amal-Holidays

This document outlines the UI design and functional requirements for the Amal-Holidays B2C platform, derived from the existing Express.js backend.

## 1. Overview & Personas
- **Tourist (User):** Primary consumer. Browses packages, makes bookings, manages payments.
- **Admin/Manager (User):** Administrative staff. Manages content (Packages, Destinations), monitors bookings/payments, reviews reports.
- **Support Roles (Staff, Guide, Driver):** Internal users with limited access for operational tasks (as per `User` model).

## 2. User Journey Mapping
- **Public Flow:** Landing Page -> Search/Filter -> Package Details -> Booking -> Payment.
- **Authenticated Flow:**
    - **Tourist:** Personal Dashboard (View Bookings, Payment History).
    - **Manager:** Admin Dashboard (Manage Content, Generate Reports).

## 3. Detailed Page Specifications

### A. Tourist Portal
- **Landing Page:** Featured destinations, search bar (filter packages by destination), call-to-action for browsing.
- **Destinations & Packages List:** Grid view of available tour packages.
- **Package Details:** Rich display of package info, price, capacity, dates. Button: "Book Now" (protected).
- **Booking Checkout:** Confirmation screen for selected package. Triggers `createBookingController`.
- **User Dashboard:** List of active and past bookings, payment status.

### B. Admin/Manager Dashboard
- **Dashboard:** Summary metrics (total bookings, revenue).
- **Package Management:** Table view of all packages with "Create/Edit/Delete" actions.
- **Destination Management:** CRUD for destinations.
- **Booking & Payment Oversight:** Table listing all system bookings and their payment verification status.
- **Reporting:** View generated insights (using `reportController`).

## 4. Functional & Component Mapping

| Feature | Backend Controller | UI Component | Role |
| :--- | :--- | :--- | :--- |
| Auth | `authController` | Login/Signup Forms | All |
| Browse Packages | `packageController.getAvailable` | Package Card/List | Tourist |
| Booking | `bookingController.create` | Checkout Form | Tourist |
| Manage Packages | `packageController` (all) | Package CRUD Table | Manager |
| Manage Destinations | `destinationController` | Destination Management | Manager |
| Analytics | `reportController` | Charts/Report Grid | Manager |

## 5. Technical Requirements
- **Authentication:** JWT-based protection for all routes.
- **Role-Based Access Control (RBAC):** UI elements conditional on `role` (e.g., Hide "Manage" buttons from Tourists).
- **Styling:** Consistent UI library (HeroUI recommended for React).
