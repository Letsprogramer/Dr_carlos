import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sectionHref = (hash) => (isHome ? `#${hash}` : `/#${hash}`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-oswald transition-all duration-300 ${
        isHeaderScrolled || !isHome ? 'bg-[#FAFAF8]/85 backdrop-blur-md shadow-sm shadow-black/5' : 'bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-[padding] duration-300 ${
          isHeaderScrolled || !isHome ? 'py-2' : 'py-3 sm:py-4'
        }`}
      >
        <Link to="/" className="flex items-center">
          <img src="/logo-final.png" alt="Souza Campos Advocacia logo" className="site-logo h-[6rem] sm:h-[7.5rem] lg:h-[10rem] max-w-[16rem] sm:max-w-[20rem] lg:max-w-[28rem] w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden items-center gap-5 rounded-full bg-white/80 px-6 py-2.5 text-xs font-semibold text-[#0A1F3D] shadow-lg shadow-black/5 ring-1 ring-black/5 backdrop-blur-md sm:text-sm md:flex">
            <a href={sectionHref('areas')} className="transition hover:text-[#C9A961]">Áreas</a>
            <a href={sectionHref('sobre')} className="transition hover:text-[#C9A961]">Sobre</a>
            <Link to="/blog" className="transition hover:text-[#C9A961]">Blog</Link>
            <a href={sectionHref('contato')} className="transition hover:text-[#C9A961]">Contato</a>
          </nav>
          <a href={sectionHref('contato')} className="inline-flex items-center justify-center rounded-full bg-[#0A1F3D] px-5 py-2.5 text-xs font-semibold text-[#FAFAF8] shadow-lg shadow-black/10 transition hover:opacity-90 sm:px-6 sm:py-3 sm:text-sm">
            Agendar Diagnóstico
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
