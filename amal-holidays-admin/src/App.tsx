import { BrowserRouter, Route, Routes } from 'react-router'
import StaffLogin from './pages/StaffLogin'
import Destinations from './pages/Destinations'
import Layout from './components/Layout'


const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Routes>
          <Route path="/login" element={<StaffLogin />} />

          {/* Admin Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<div className="p-8">Dashboard Content Coming Soon</div>} />
            <Route path="/bookings" element={<div className="p-8">Bookings Content Coming Soon</div>} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/packages" element={<div className="p-8">Packages Content Coming Soon</div>} />
            <Route path="/payments" element={<div className="p-8">Payments Content Coming Soon</div>} />
            <Route path="/users" element={<div className="p-8">Users Content Coming Soon</div>} />
            <Route path="/management" element={<div className="p-8">Management Content Coming Soon</div>} />
            <Route path="/settings" element={<div className="p-8">Settings Content Coming Soon</div>} />
          </Route>

          {/* Catch-all for 404s outside layout */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
