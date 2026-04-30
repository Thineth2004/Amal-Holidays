const Footer = () => {
  return (
      <footer className="relative z-10 bg-white border-t border-gray-200 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-lg font-bold text-gray-900 font-nav-md">Amal Holidays</span>
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Amal Holidays. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['About Us', 'Support', 'Privacy', 'Terms'].map(item => (
              <a key={item} className="text-sm text-gray-500 hover:text-[#0059bb] transition-colors" href="#">{item}</a>
            ))}
          </div>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#717786] hover:text-[#0059bb] transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#717786] hover:text-[#0059bb] transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">language</span>
            </a>
          </div>
        </div>
      </footer>
  )
}

export default Footer
