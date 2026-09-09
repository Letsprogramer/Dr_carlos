import { Link } from 'react-router-dom'
import { ChevronRight, Clock3 } from 'lucide-react'

function ArticleCard({ post }) {
  return (
    <article data-reveal className="reveal group flex flex-col overflow-hidden rounded-none border border-[#E4E7EC] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/blog/${post.slug}`} className="relative block h-52 overflow-hidden bg-[#0A1F3D] sm:h-56">
        <img
          src={post.cover}
          alt={post.coverAlt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#0A1F3D]/35 transition duration-300 group-hover:bg-[#0A1F3D]/50" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">{post.category}</span>
        <h3 className="mt-4 font-oswald text-xl font-semibold leading-snug text-[#0A1F3D]">
          <Link to={`/blog/${post.slug}`} className="transition hover:text-[#0A1F3D]/80">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-[#6D7482]">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-between border-t border-[#E4E7EC] pt-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#8B95A5]">
            <Clock3 className="h-3.5 w-3.5" /> {post.readTime}
          </span>
          <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-semibold text-[#C9A961] transition hover:text-[#0A1F3D]">
            Ler artigo <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
