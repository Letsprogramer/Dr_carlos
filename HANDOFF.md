# Handoff — Site Souza Campos Advocacia

Documento de repasse para o próximo desenvolvedor.

## 1. Stack

| Item | Valor |
|---|---|
| Framework | React 19 + Vite 8 |
| Estilo | Tailwind CSS v4 (plugin `@tailwindcss/vite`) |
| Rotas | `react-router-dom` v7 (SPA, 3 rotas) |
| Ícones | `lucide-react` |
| Lint | `oxlint` |
| Node | 20+ (desenvolvido em v24) |
| Hospedagem | Vercel (site estático) |
| Deploy alternativo | container com `nginx.conf` (não usado hoje) |

Não há back-end, banco de dados, formulários ou autenticação. O front **não lê
variáveis de ambiente** (`import.meta.env` não é usado em nenhum lugar).

## 2. Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview    # serve o build
npm run lint
```

## 3. Estrutura

```
src/
  App.jsx              rotas: / , /blog , /blog/:slug
  main.jsx             entrypoint
  pages/               Home.jsx, Blog.jsx, BlogPost.jsx
  components/          Header, Footer, WhatsAppButton, ArticleCard, icons/
  hooks/               useSeo.js (meta tags + JSON-LD), useReveal.js (animação scroll)
  data/
    areas.js           áreas de atuação (texto + imagem)
    blogPosts.js        artigos do blog (conteúdo em blocos: h2/h3/quote/p)
index.html             <title>, meta description, canonical, google-site-verification
public/                favicons, logo, vídeo/imagens do hero, robots.txt, sitemap.xml
```

### Editar conteúdo
- **Artigos do blog:** `src/data/blogPosts.js` — cada post tem `slug`, `seoTitle`,
  `seoDescription`, `cover`, `content` (array de blocos).
- **Áreas de atuação:** `src/data/areas.js`.
- **Textos da home:** `src/pages/Home.jsx`.
- **SEO por página:** hook `useSeo({...})` chamado dentro de cada página.
- **Sitemap:** `public/sitemap.xml` é manual — atualizar ao criar/remover páginas.

## 4. Deploy

O projeto já está ligado a um projeto Vercel (pasta `.vercel/`, **não** compartilhar).

### Opção A — CLI (rápido)
```bash
npm i -g vercel        # se necessário
vercel login
vercel                 # deploy de preview
vercel --prod          # deploy de produção
```

### Opção B — Git (recomendado a partir do repasse)
1. Subir o repositório para GitHub/GitLab.
2. No dashboard da Vercel: Project → Settings → Git → conectar o repositório.
3. A partir daí cada push na branch de produção faz deploy automático.
   - Build command: `npm run build`  ·  Output: `dist`  ·  Install: `npm install`

O `nginx.conf` **não é usado pela Vercel** — só serve para um deploy próprio em
container/VPS. Se for esse o caminho, os certificados TLS vão em `/etc/nginx/ssl/`.

## 5. Segurança

Ver [`SECURITY.md`](SECURITY.md). Cabeçalhos (CSP, HSTS, X-Frame-Options, etc.)
ficam em `vercel.json` e replicados em `nginx.conf`.
**Ao adicionar recurso externo novo (analytics, pixel, CDN, iframe, fonte), é
obrigatório atualizar a CSP nos dois arquivos** ou o navegador bloqueia sem avisar.

## 6. Acessos que precisam ser repassados

| Acesso | Onde / observação |
|---|---|
| **Vercel** | Time `team_yifUl39Cx9TSkpgNkqmFP36p`, projeto `project-y9w3u`. Adicionar o novo dev como membro do time **ou** transferir o projeto (Settings → Advanced → Transfer). |
| **Domínio** | `souzacamposadvise.com.br` — informar o registrador (registro.br provavelmente) e login. DNS aponta para a Vercel. |
| **Google Search Console** | Existe verificação no `index.html` (`google-site-verification`). Repassar a propriedade no GSC / conta Google. |
| **Repositório Git** | Criar e dar acesso (ver seção 7 — hoje **não existe** versionamento). |
| **Variáveis de ambiente na Vercel** | Conferir Project → Settings → Environment Variables e repassar o que houver (o código atual não usa nenhuma). |
| **Analytics** | Nenhum instalado no código no momento. |
| **Contatos do cliente** | WhatsApp `+55 19 99251-6000`, Instagram `@ctcs.adv` (usados em links no site). |
| **Imagens do hero/áreas** | Fotos de capa hoje vêm do CDN do Unsplash (hotlink). Ideal: baixar para `public/` e servir localmente. |

## 7. Versionamento (fazer antes do repasse)

Hoje a pasta **não é um repositório git**. Antes de entregar:

```bash
git init
git add .
git commit -m "Estado atual do site"
git branch -M main
git remote add origin <URL-do-repo>
git push -u origin main
```

O `.gitignore` já exclui `node_modules/`, `dist/`, `.env*` e `.vercel/`.
**Não** commitar `.env.local` nem `.vercel/` (o novo dev gera o dele com `vercel link`).

## 8. Checklist de repasse

- [ ] Repositório git criado e enviado para o novo dev
- [ ] Novo dev com acesso à Vercel (membro do time ou projeto transferido)
- [ ] Domínio: registrador e DNS repassados
- [ ] Google Search Console repassado
- [ ] Env vars da Vercel conferidas e repassadas (se houver)
- [ ] `npm install && npm run build` roda limpo na máquina do novo dev
- [ ] `vercel --prod` (ou push no git) publica com sucesso
- [ ] Remover acessos antigos após confirmação
