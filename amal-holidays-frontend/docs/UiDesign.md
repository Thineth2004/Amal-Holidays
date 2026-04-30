# UI Component Design Specification: Amal-Holidays

This document provides a granular breakdown of the UI for each page, detailing the content, interactive elements, and components required for implementation based on the `WebpageDesign.md` and the backend structure.

## 1. Global Components (Layout)
- **Navbar:**
    - Logo (Amal Holidays).
    - Links: Home, Destinations, Packages.
    - Auth Actions: Login/Register (Tourist), Profile, Logout (Authenticated), Dashboard Link (Manager).
- **Footer:** Copyright, Quick Links, Contact Info.

## 2. Tourist Portal Pages

### A. Landing Page
- **Hero Section:** High-quality image, welcome text, CTA "Explore Packages".
- **Search Bar:** Input field for destination/keywords, date picker, "Search" button.
- **Featured Destinations:** Grid of cards (Destination Name, Image, "View Packages" button).

### B. Destinations & Packages Listing
- **Filter Sidebar:** Filter by Date Range, Price Range, Destination.
- **Package Grid:** List of `TourPackage` cards.
    - **Card Content:** Title, Price, Available Slots, Brief Description.
    - **Actions:** "View Details" button.

### C. Package Details
- **Main Content:** Hero image, Title, Detailed Description, Pricing, Dates.
- **Booking Sidebar:** "Book Now" button (triggers login check), Available Capacity display.

### D. Booking Checkout
- **Form:**
    - User Details (pre-filled from profile).
    - Package Selection Confirmation.
    - Payment Information Input.
- **Action:** "Confirm Booking" button (POST `/api/bookings`).

### E. User Dashboard
- **Profile Summary:** Name, Email, Role.
- **Booking List:** Table/List of bookings.
    - Columns: Package Title, Dates, Status, Total Paid.

## 3. Admin/Manager Dashboard Pages

### A. Admin Overview Dashboard
- **Metric Cards:** Total Bookings, Total Revenue, Available Slots, Active Users.
- **Recent Activity:** Table of latest bookings.

### B. Package Management
- **Action Bar:** "Create New Package" button.
- **Data Table:** All Packages.
    - Columns: Title, Price, Capacity, Availability, Actions (Edit/Delete).
- **CRUD Modal:** Form for creating/editing `TourPackage`.

### C. Destination Management
- **Action Bar:** "Add Destination" button.
- **Data Table:** List of Destinations.
    - Columns: Name, Description, Actions (Edit/Delete).

### D. Booking & Payment Oversight
- **Data Table:** All system bookings.
    - Columns: Tourist Name, Package, Date, Amount, Payment Status, Action (Verify Payment).

### E. Analytics Reporting
- **Visualization:** Charts (Bookings over time, Revenue breakdown).
- **Export:** "Download Report" button.

## 4. Technical Implementation Notes
- **Forms:** Use controlled components for validation.
- **Conditional Rendering:**
    - Use `isAuthenticated` and `role` to toggle route access and UI visibility.
- **HeroUI Recommendations:**
    - **Nav:** `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`.
    - **Tables:** `Table`, `TableHeader`, `TableBody`.
    - **Cards:** `Card`, `CardBody`, `CardHeader`.
    - **Forms:** `Input`, `Button`, `Select`, `Modal`.
