import { BrowserRouter, Route, Routes } from 'react-router'
import StaffLogin from './pages/StaffLogin'
import Destinations from './pages/Destinations'
import Layout from './components/Layout'
import Packages from './pages/Packages'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
import Users from './pages/Users'
import Hotels from './pages/Hotels'
import Drivers from './pages/Drivers'
import TourGuides from './pages/TourGuides'
import Inquiries from './pages/Inquiries'


const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Routes>
          <Route path="/login" element={<StaffLogin />} />

          {/* Admin Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<div className="p-8">Dashboard Content Coming Soon</div>} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/tour-guides" element={<TourGuides />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/inquiries" element={<Inquiries />} />
          </Route>

          {/* Catch-all for 404s outside layout */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
