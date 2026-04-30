import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Packages from './pages/Packages'
import PackageDetails from './pages/PackageDetails'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import PasswordReset from './pages/ResetPassword'

const App = () => {
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Main Content */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<LogIn />} />
          <Route path="/password-reset" element={<PasswordReset />} />

          {/* Catch-all for 404s */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
