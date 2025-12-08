export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 sm:py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
        
        <div className="text-sm sm:text-xs">
          &copy; {new Date().getFullYear()} StillyMathPro. All rights reserved.
        </div>
        
        <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-0">
          Advanced math education, serving students around the world.
        </div>
        
        <nav className="flex gap-4 mt-2 sm:mt-0 text-sm sm:text-xs">
          <a href="/about" className="hover:text-emerald-400 transition" aria-label="About StillwaterMathPro">
            About
          </a>
          <a href="/contact" className="hover:text-emerald-400 transition" aria-label="Contact StillwaterMathPro">
            Contact
          </a>
        </nav>

      </div>
    </footer>
  )
}
