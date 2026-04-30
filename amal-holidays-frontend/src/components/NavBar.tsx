import { useAuth } from '../hooks/useAuth';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  const links = [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'Destinations',
      href: '/destinations'
    },
    {
      name: 'Packages',
      href: '/packages'
    }
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a className="text-2xl font-normal tracking-tight text-[#0059bb] font-nav-md" href="/">
          Amal Holidays
        </a>

        <div className="hidden md:flex items-center gap-2 px-2 py-2 bg-white/20 backdrop-blur-xl border border-slate-200 rounded-full shadow-sm">
          {links.map((link) => (
            <a
              key={link.href}
              className="px-6 py-1.5 font-medium text-sm text-gray-600 hover:opacity-80 transition-all"
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <a className="text-gray-600 font-medium text-sm hover:opacity-80 transition-all" href="/signin">
                Sign In
              </a>
              <a href="/signup" className="bg-[#0059bb] text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-sm active:scale-95 transition-all">
                Sign Up
              </a>
            </>
          ) : (
            <button 
                onClick={logout}
                className="text-white bg-red-400 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-red-500 transition-all"
            >
                Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
