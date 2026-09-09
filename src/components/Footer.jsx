import { Link } from 'react-router-dom'
import { areas } from '../data/areas'

function Footer() {
  return (
    <footer data-reveal className="reveal border-t border-[#E4E7EC] bg-[#FAFAF8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img src="/logo-final.png" alt="Souza Campos Advocacia logo" className="site-logo h-20 sm:h-24 w-auto object-contain" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#0A1F3D]">Souza Campos</p>
            <p className="mt-1 text-sm text-[#6D7482]">Advocacia & Consultoria Legal — Rio Claro, SP</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B95A5]">Áreas de atuação</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#6D7482]">
              {areas.map((area) => (
                <li key={area.id}>
                  <Link to={`/#${area.id}`} className="transition hover:text-[#C9A961]">
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[#6D7482] md:items-end">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B95A5] md:text-right">Links</p>
            <Link to="/blog" className="transition hover:text-[#C9A961]">Blog</Link>
            <a href="#" className="transition hover:text-[#C9A961]">Política de Privacidade</a>
            <a href="#" className="transition hover:text-[#C9A961]">LGPD</a>
            <a href="https://instagram.com/ctcs.adv" target="_blank" rel="noreferrer" className="transition hover:text-[#C9A961]">Instagram</a>
            <a href="https://wa.me/5519992516000" target="_blank" rel="noreferrer" className="transition hover:text-[#C9A961]">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
