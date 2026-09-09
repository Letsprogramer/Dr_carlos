import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { useSeo, SITE_URL } from '../hooks/useSeo'
import InstagramIcon from '../components/icons/InstagramIcon'
import { blogPosts } from '../data/blogPosts'
import { areas } from '../data/areas'

const heroSlides = [
  {
    eyebrow: '',
    title: 'Soluções jurídicas com segurança, clareza e estratégia.',
    description:
      'Assessoria jurídica de alto nível para empresas e pessoas que buscam decisão técnica, preventiva e alinhada aos seus objetivos.',
    body: 'Prevenir conflitos antes que se tornem custos.',
    footer: 'Cada atuação é orientada por visão empresarial, atenção aos detalhes e respeito à realidade do cliente.',
    image: '/hero-1-poster.jpg',
    video: '/hero-1.webm',
  },
  {
    eyebrow: 'Visão preventiva',
    title: 'Prevenir conflitos antes que se tornem custos.',
    description:
      'A atuação começa com diagnóstico claro, análise de riscos e orientação prática para decisões mais seguras.',
    body: 'Um primeiro encontro pode esclarecer o caminho certo.',
    footer: 'Estruturação, revisão e antecipação de riscos antes que se materializem.',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Perfil do escritório',
    title: 'Atuação jurídica firme, humana e alinhada.',
    description:
      'Advogado com formação sólida, visão preventiva e atuação comprometida com a segurança jurídica dos seus clientes.',
    body: 'Atuação jurídica firme, humana e alinhada ao contexto do cliente.',
    footer: 'Formação acadêmica e compromisso profissional em cada etapa.',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
  },
]

const featuredPosts = blogPosts.slice(0, 3)

const attorneyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Attorney',
  name: 'Carlos Henrique de Castro Tolosa de Souza Campos',
  alternateName: 'Souza Campos Advocacia',
  image: `${SITE_URL}/hero-2.jpeg`,
  url: SITE_URL,
  telephone: '+5519992516000',
  email: 'carlos@souzacampos.adv.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida 3, 830 - Centro',
    addressLocality: 'Rio Claro',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  areaServed: ['Rio Claro', 'Limeira', 'Piracicaba', 'Araras', 'Brasil'],
  priceRange: '$$',
  sameAs: ['https://instagram.com/ctcs.adv'],
  knowsAbout: [
    'Societário e Governance',
    'Contratos e Negócios',
    'Compliance e Regulatório',
    'Direito Criminal',
    'Contencioso Estratégico',
    'Direito Tributário',
    'Direito Trabalhista',
    'Direito Imobiliário',
    'Família e Sucessões',
  ],
}

function Home() {
  useSeo({
    title: 'Advogado em Rio Claro e Região | Souza Campos Advocacia',
    description:
      'Escritório de advocacia em Rio Claro-SP com mais de 40 anos de experiência. Direito Empresarial, Tributário, Trabalhista, Criminal e Consultoria Jurídica para empresas e pessoas físicas.',
    path: '/',
    image: `${SITE_URL}/hero-2.jpeg`,
    jsonLd: attorneyJsonLd,
  })

  const [activeSlide, setActiveSlide] = useState(0)
  const [activeAreaIndex, setActiveAreaIndex] = useState(0)
  const [isAreaPaused, setIsAreaPaused] = useState(false)
  const areaTrackRef = useRef(null)
  const areaItemRefs = useRef([])
  const heroVideoRef = useRef(null)

  const advanceSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length)
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const currentSlideHasVideo = Boolean(heroSlides[activeSlide].video) && !prefersReducedMotion

    if (currentSlideHasVideo) {
      // Advance is triggered by the video's onEnded handler instead of a fixed timer.
      return undefined
    }

    const timeout = window.setTimeout(advanceSlide, 5000)
    return () => window.clearTimeout(timeout)
  }, [activeSlide, prefersReducedMotion])

  useEffect(() => {
    if (heroSlides[activeSlide].video && heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0
      heroVideoRef.current.play().catch(() => {})
    }
  }, [activeSlide])

  useReveal()

  useEffect(() => {
    if (isAreaPaused || areas.length === 0) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setActiveAreaIndex((current) => (current + 1) % areas.length)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [isAreaPaused])

  useEffect(() => {
    const track = areaTrackRef.current
    const target = areaItemRefs.current[activeAreaIndex]

    if (track && target) {
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
    }
  }, [activeAreaIndex])

  const handlePrevArea = () => {
    setActiveAreaIndex((current) => (current - 1 + areas.length) % areas.length)
  }

  const handleNextArea = () => {
    setActiveAreaIndex((current) => (current + 1) % areas.length)
  }

  const slide = heroSlides[activeSlide]

  return (
    <main id="home">
      <section data-reveal className="reveal relative overflow-hidden bg-[#F8F9FB] text-[#0A1F3D]">
        <div className="absolute inset-0">
          {heroSlides.map((item, index) => (
            <div
              key={item.title}
              className={`absolute inset-0 overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            >
              {item.video && !prefersReducedMotion ? (
                <video
                  ref={heroVideoRef}
                  className="h-full w-full object-cover object-center"
                  src={item.video}
                  poster={item.image}
                  autoPlay
                  muted
                  playsInline
                  onEnded={advanceSlide}
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundPosition: index === 0 ? 'center 38%' : 'center',
                    backgroundSize: 'cover',
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-white/45" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-40 sm:px-6 sm:pb-20 sm:pt-48 lg:px-8 lg:pb-24 lg:pt-56">
          <div className="max-w-3xl">
            {slide.eyebrow && <p className="mb-4 font-serif text-xl text-[#C9A961]">{slide.eyebrow}</p>}
            <h1 className="font-oswald text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-[#0A1F3D]" style={{ textShadow: '0 0 20px rgba(255,255,255,0.18)' }}>
              {slide.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4E5767]" style={{ textShadow: '0 0 14px rgba(255,255,255,0.14)' }}>
              {slide.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contato" className="inline-flex items-center justify-center rounded-none bg-[#C9A961] px-7 py-3.5 text-sm font-semibold text-[#0A1F3D] transition hover:opacity-90">
                Agendar Diagnóstico <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#areas" className="inline-flex items-center justify-center rounded-none border border-[#C9A961]/60 bg-[#0A1F3D] px-7 py-3.5 text-sm font-semibold text-[#FAFAF8] transition hover:border-[#C9A961] hover:bg-[#142C4B] hover:text-[#FAFAF8]">
                Conhecer Áreas de Atuação
              </a>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-7xl justify-end px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {heroSlides.map((item, index) => (
              <span key={item.title} className={`h-2 w-4 rounded-none ${index === activeSlide ? 'bg-[#C9A961]' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="areas" data-reveal className="reveal mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8B95A5]">Áreas de atendimento</p>
            <h2 className="mt-4 font-oswald text-3xl font-bold text-[#0A1F3D] sm:text-4xl">
            Atuação ampla, com foco em soluções práticas e seguras.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#4E5767]">
            O escritório acompanha demandas corporativas e pessoais com linguagem acessível, estratégia jurídica e atenção aos riscos reais.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-none border border-[#E4E7EC] bg-[#F8F9FB] p-6 shadow-sm">
          <div className="mb-4 flex justify-end">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrevArea}
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-[#E4E7EC] bg-[#C9A961] text-[#0A1F3D] shadow-sm transition hover:bg-[#B8A55D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A961]"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextArea}
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-[#E4E7EC] bg-[#C9A961] text-[#0A1F3D] shadow-sm transition hover:bg-[#B8A55D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A961]"
                aria-label="Próximo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={areaTrackRef}
              onMouseEnter={() => setIsAreaPaused(true)}
              onMouseLeave={() => setIsAreaPaused(false)}
              className="area-carousel flex gap-6 pb-4"
            >
            {areas.map((area, index) => {
              return (
                <article
                  key={area.id}
                  id={area.id}
                  data-reveal
                  className="reveal group snap-start min-w-[260px] max-w-[280px] flex-none scroll-mt-28 overflow-hidden rounded-none border border-[#E4E7EC] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  ref={(el) => (areaItemRefs.current[index] = el)}
                >
                  <div className="relative h-52 overflow-hidden bg-[#0A1F3D]">
                    <img src={area.image} alt={`${area.title} — Souza Campos Advocacia em Rio Claro`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3D]/80 via-[#0A1F3D]/20 to-transparent" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-[#0A1F3D]">{area.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6D7482]">{area.description}</p>
                    <a href="#contato" className="mt-6 inline-flex items-center text-sm font-semibold text-[#0A1F3D] transition group-hover:text-[#C9A961]">
                      Solicitar orientação <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
      </section>

      <section id="sobre" className="bg-[#0A1F3D] py-20 text-[#FAFAF8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="relative rounded-none border border-[#C9A961]/25 bg-[#FAFAF8]/10 p-4 backdrop-blur-sm">
            <img
              src="/hero-2.jpeg"
              alt="Dr. Carlos Henrique de Castro Tolosa de Souza Campos, advogado em Rio Claro"
              className="h-full min-h-[640px] w-full rounded-none object-cover"
            />
            <div className="absolute bottom-3 right-3 flex flex-col items-center justify-center rounded-none border border-[#C9A961] bg-[#0A1F3D] px-5 py-4 text-center shadow-xl sm:-bottom-6 sm:-right-6 sm:px-6 sm:py-5">
              <span className="font-oswald text-4xl font-black leading-none text-[#C9A961] sm:text-5xl">40+</span>
              <span className="mt-2 max-w-[9rem] text-xs font-semibold uppercase leading-tight tracking-[0.15em] text-[#FAFAF8]">
                Anos de experiência
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#C9A961]">Quem sou?</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
              Dr. Carlos Henrique de Castro Tolosa de Souza Campos
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#D9E1EB]">
              Advogado com <span className="font-semibold text-[#C9A961]">40 anos de experiência</span>, formação sólida, visão preventiva e atuação comprometida com a segurança jurídica dos seus clientes.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-none border border-[#C9A961]/20 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C9A961]">Experiência</p>
                <p className="mt-2 text-sm leading-7 text-[#F4F6F9]">40 anos de atuação jurídica</p>
              </div>
              <div className="rounded-none border border-[#C9A961]/20 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C9A961]">Formação</p>
                <p className="mt-2 text-sm leading-7 text-[#F4F6F9]">UNICAMP · PUC Campinas · FGV</p>
              </div>
              <div className="rounded-none border border-[#C9A961]/20 bg-white/5 p-5 sm:col-span-2">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C9A961]">OAB</p>
                <p className="mt-2 text-sm leading-7 text-[#F4F6F9]">Inscrição profissional disponível ao cliente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="reveal mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-none border border-[#E4E7EC] bg-[#F8F9FB] p-8 shadow-sm lg:p-10 font-serif">
          <div className="max-w-3xl">
            <p className="text-sm font-oswald font-semibold uppercase tracking-[0.35em] text-[#8B95A5]">Como trabalhamos</p>
            <h2 className="mt-4 font-oswald text-3xl font-bold text-[#0A1F3D] sm:text-4xl">
              Acompanhamento jurídico claro, estratégico e focado em proteção.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Diagnóstico inicial',
                text: 'Entendemos o cenário, os riscos e as prioridades antes de qualquer recomendação.',
                image:
                  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
              },
              {
                title: 'Orientação estratégica',
                text: 'Elaboramos caminhos objetivos e compatíveis com a realidade do cliente.',
                image:
                  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
              },
              {
                title: 'Acompanhamento contínuo',
                text: 'Apoio próximo em cada fase, com comunicação simples e decisões mais seguras.',
                image:
                  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
              },
            ].map((item) => {
              return (
                <div key={item.title} data-reveal className="reveal overflow-hidden rounded-none border border-[#E4E7EC] bg-white shadow-sm">
                  <div className="relative h-36 overflow-hidden bg-[#0A1F3D]">
                    <img src={item.image} alt={`${item.title} — acompanhamento jurídico Souza Campos Advocacia`} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3D]/80 via-[#0A1F3D]/20 to-transparent" />
                  </div>
                  <div className="p-6 font-serif">
                    <h3 className="text-xl font-oswald font-semibold text-[#0A1F3D]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6D7482]">{item.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="blog" data-reveal className="reveal bg-[#F2F4F7] py-20">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8B95A5]">Conteúdo jurídico</p>
              <h2 className="mt-3 font-oswald text-3xl font-bold text-[#0A1F3D] sm:text-4xl">
                Artigos e insights.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#4E5767]">
                Conteúdos que conectam a atuação jurídica ao dia a dia dos clientes, com foco em prevenção, estratégia e visão prática.
              </p>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-[#0A1F3D] transition hover:text-[#C9A961]">
              Ver todos os artigos
            </Link>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <article key={post.slug} data-reveal className="reveal overflow-hidden rounded-none border border-[#E4E7EC] bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <Link to={`/blog/${post.slug}`} className="block h-72 overflow-hidden bg-[#D9D2C2] sm:h-80">
                  <img src={post.cover} alt={post.coverAlt} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </Link>
                <div className="p-8">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8B95A5]">
                    {post.category}
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-[#0A1F3D]">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-4 text-sm leading-8 text-[#6D7482]">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#8B95A5]">
                      <Clock3 className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-semibold text-[#0A1F3D] transition hover:text-[#C9A961]">
                      Ler mais <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" data-reveal className="reveal mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-none border border-[#E4E7EC] bg-[#0A1F3D] p-8 text-[#FAFAF8] shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#C9A961]">Contato</p>
            <h2 className="mt-4 font-oswald text-3xl font-bold sm:text-4xl">
              Fale com um escritório que valoriza clareza, estratégia e resposta prática.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#D9E1EB]">
              Para agendar um diagnóstico jurídico, envie seus dados e uma breve descrição da demanda.
            </p>
            <div className="mt-8 space-y-4 text-sm text-[#F3F6FA]">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-[#C9A961]" /> <a href="tel:+5519992516000" className="transition hover:text-white">(19) 99251-6000</a></div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#C9A961]" /> <a href="mailto:carlos@souzacampos.adv.br" className="transition hover:text-white">carlos@souzacampos.adv.br</a></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#C9A961]" /> Avenida 3, 830 - Centro - Rio Claro - SP</div>
              <div className="flex items-center gap-3"><InstagramIcon className="h-4 w-4 text-[#C9A961]" /> <a href="https://instagram.com/ctcs.adv" target="_blank" rel="noreferrer" className="transition hover:text-white">@ctcs.adv</a></div>
              <div className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-[#C9A961]" /> Atendimento por agenda</div>
            </div>
          </div>
          <form className="rounded-none border border-[#C9A961]/20 bg-[#FAFAF8]/10 p-6 backdrop-blur-sm">
            <div className="grid gap-4">
              <input className="rounded-none border border-[#C9A961]/20 bg-[#FAFAF8] px-4 py-3 text-[#0A1F3D] outline-none" placeholder="Nome" />
              <input className="rounded-none border border-[#C9A961]/20 bg-[#FAFAF8] px-4 py-3 text-[#0A1F3D] outline-none" placeholder="Telefone" />
              <textarea className="min-h-32 rounded-none border border-[#C9A961]/20 bg-[#FAFAF8] px-4 py-3 text-[#0A1F3D] outline-none" placeholder="Resumo do caso" />
              <button type="button" className="inline-flex items-center justify-center rounded-none bg-[#C9A961] px-6 py-3 text-sm font-semibold text-[#0A1F3D] transition hover:opacity-90">
                Enviar mensagem <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Home
