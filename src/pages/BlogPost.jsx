import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronRight, Clock3, MessageCircle } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { useSeo, SITE_URL } from '../hooks/useSeo'
import { getPostBySlug, getRelatedPosts } from '../data/blogPosts'
import ArticleCard from '../components/ArticleCard'

function ArticleBlock({ block, index }) {
  if (block.type === 'h2') {
    return (
      <h2 key={index} className="mt-10 font-oswald text-2xl font-semibold text-[#0A1F3D] sm:text-3xl">
        {block.text}
      </h2>
    )
  }

  if (block.type === 'h3') {
    return (
      <h3 key={index} className="mt-8 font-oswald text-xl font-semibold text-[#0A1F3D]">
        {block.text}
      </h3>
    )
  }

  if (block.type === 'quote') {
    return (
      <blockquote key={index} className="my-10 border-l-4 border-[#C9A961] bg-[#F8F9FB] py-4 pl-6 pr-4 font-serif text-xl italic leading-8 text-[#0A1F3D]">
        {block.text}
      </blockquote>
    )
  }

  return (
    <p key={index} className="mt-6 text-lg leading-8 text-[#3D4657]">
      {block.text}
    </p>
  )
}

function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  useReveal([slug])

  useSeo({
    title: post ? post.seoTitle : 'Artigo não encontrado | Souza Campos Advocacia',
    description: post ? post.seoDescription : '',
    path: post ? `/blog/${post.slug}` : '/blog',
    image: post ? post.cover : undefined,
    type: 'article',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.seoDescription,
          image: post.cover,
          author: {
            '@type': 'Person',
            name: 'Carlos Henrique de Castro Tolosa de Souza Campos',
          },
          datePublished: post.dateISO,
          publisher: {
            '@type': 'Organization',
            name: 'Souza Campos Advocacia',
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/logo-final.png`,
            },
          },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        }
      : undefined,
  })

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const relatedPosts = getRelatedPosts(post.slug, 3)

  return (
    <main className="pt-28 sm:pt-32">
      <nav className="mx-auto max-w-4xl px-4 pt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#8B95A5] sm:px-6 lg:px-8">
        <Link to="/" className="transition hover:text-[#C9A961]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/blog" className="transition hover:text-[#C9A961]">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-[#0A1F3D]">{post.title}</span>
      </nav>

      <header data-reveal className="reveal mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">{post.category}</span>
        <h1 className="mt-4 font-oswald text-3xl font-bold leading-tight text-[#0A1F3D] sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6D7482]">
          <span>{post.dateDisplay}</span>
          <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> {post.readTime}</span>
        </div>
      </header>

      <div data-reveal className="reveal relative mx-auto h-64 max-w-6xl overflow-hidden sm:h-80 lg:h-[26rem]">
        <img src={post.cover} alt={post.coverAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0A1F3D]/30" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,720px)_280px] lg:justify-between">
          <article className="font-serif">
            {post.content.map((block, index) => (
              <ArticleBlock key={index} block={block} index={index} />
            ))}
            {post.relatedArea && (
              <p className="mt-10 border-t border-[#E4E7EC] pt-6 text-lg leading-8 text-[#3D4657]">
                Precisa de apoio jurídico nessa frente? Conheça nossa atuação em{' '}
                <Link to={`/#${post.relatedArea.id}`} className="font-semibold text-[#0A1F3D] underline decoration-[#C9A961] decoration-2 underline-offset-4 transition hover:text-[#C9A961]">
                  {post.relatedArea.label}
                </Link>
                .
              </p>
            )}
          </article>

          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <div data-reveal className="reveal rounded-none border border-[#E4E7EC] bg-[#0A1F3D] p-6 text-[#FAFAF8] shadow-lg">
              <p className="font-oswald text-lg font-semibold leading-snug">
                Precisa de ajuda com isso na sua empresa?
              </p>
              <p className="mt-3 text-sm leading-6 text-[#D9E1EB]">
                Agende um diagnóstico jurídico e entenda como proteger seu negócio.
              </p>
              <a
                href="https://wa.me/5519992516000?text=Olá%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-none bg-[#C9A961] px-5 py-3 text-sm font-semibold text-[#0A1F3D] transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section data-reveal className="reveal border-t border-[#E4E7EC] bg-[#F2F4F7] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="font-oswald text-2xl font-bold text-[#0A1F3D] sm:text-3xl">Artigos relacionados</h2>
              <Link to="/blog" className="hidden items-center text-sm font-semibold text-[#0A1F3D] transition hover:text-[#C9A961] sm:inline-flex">
                Ver todos <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <ArticleCard key={related.slug} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default BlogPost
