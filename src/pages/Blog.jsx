import { useReveal } from '../hooks/useReveal'
import { useSeo } from '../hooks/useSeo'
import { blogPosts } from '../data/blogPosts'
import ArticleCard from '../components/ArticleCard'

function Blog() {
  useSeo({
    title: 'Artigos Jurídicos | Souza Campos Advocacia',
    description:
      'Análises práticas sobre direito empresarial, prevenção jurídica, contratos e tecnologia aplicada à advocacia, escritas com base em décadas de experiência.',
    path: '/blog',
  })

  useReveal()

  return (
    <main className="pt-32 sm:pt-40">
      <section data-reveal className="reveal mx-auto max-w-4xl px-4 pb-4 pt-8 text-center sm:px-6 lg:px-8">
        <p className="font-serif text-2xl italic text-[#C9A961]">insights</p>
        <h1 className="mt-3 font-oswald text-4xl font-bold text-[#0A1F3D] sm:text-5xl">Conteúdo Jurídico</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4E5767]">
          Análises práticas para proteger e fortalecer o seu negócio.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Blog
