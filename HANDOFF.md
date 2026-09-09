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
| Build | `npm run build` → pasta `dist/` (100% estático) |

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
public/
  _headers, _redirects  config para Cloudflare Pages / Netlify
  favicons, logo, hero, robots.txt, sitemap.xml
vercel.json             config para deploy na Vercel (headers + SPA rewrite)
nginx.conf              config para deploy em VPS própria (alternativa)
deploy/                 script + snippet para o cenário de VPS própria
```

### Editar conteúdo
- **Artigos do blog:** `src/data/blogPosts.js` — cada post tem `slug`, `seoTitle`,
  `seoDescription`, `cover`, `content` (array de blocos).
- **Áreas de atuação:** `src/data/areas.js`.
- **Textos da home:** `src/pages/Home.jsx`.
- **SEO por página:** hook `useSeo({...})` chamado dentro de cada página.
- **Sitemap:** `public/sitemap.xml` é manual — atualizar ao criar/remover páginas.

## 4. Hospedagem e deploy

O site é estático. O destino recomendado é um host de site estático com deploy
por git (**Vercel** ou **Cloudflare Pages**): grátis, HTTPS automático, sem
servidor para manter. O repositório já vem pronto para os dois.

> Importante: a conta de hospedagem deve ser **do cliente** (e‑mail do escritório),
> não a conta pessoal de quem está repassando. Assim o próximo dev assume só com o login.

### Opção A — Vercel (recomendado)
1. Criar conta em vercel.com com o e‑mail do cliente.
2. **Add New → Project → Import** o repositório `Letsprogramer/Dr_carlos`.
3. Framework detectado: **Vite** · Build: `npm run build` · Output: `dist`.
4. Deploy. A Vercel lê o [`vercel.json`](vercel.json) (cabeçalhos de segurança + rewrite de SPA).
5. **Settings → Domains** → adicionar `souzacamposadvise.com.br` e `www` → seguir os
   registros DNS que a Vercel indicar (ver seção 6).
6. Cada `git push` na `main` publica automaticamente.

### Opção B — Cloudflare Pages
Mesma ideia. Build `npm run build`, output `dist`. Usa
[`public/_headers`](public/_headers) e [`public/_redirects`](public/_redirects)
(copiados para `dist/` no build).

### Opção C — VPS própria (só se realmente quiser servidor)
Arquivos prontos no repo: [`nginx.conf`](nginx.conf) e
[`deploy/`](deploy/) (script `deploy.sh` com build + `rsync --delete` + reload, e
o snippet `nginx-security-headers.conf` → `/etc/nginx/snippets/`). TLS via
`certbot --nginx`. **Não** usar uma VPS compartilhada com outros projetos se o
acesso vai ser repassado.

## 5. Segurança

Ver [`SECURITY.md`](SECURITY.md). Os mesmos cabeçalhos (CSP, HSTS, X‑Frame‑Options…)
estão em **três formatos** que precisam ficar em sincronia:
- [`vercel.json`](vercel.json) — Vercel
- [`public/_headers`](public/_headers) — Cloudflare Pages / Netlify
- [`deploy/nginx-security-headers.conf`](deploy/nginx-security-headers.conf) — VPS

**Ao adicionar recurso externo novo (analytics, pixel, CDN, iframe, fonte), atualize
a CSP nos formatos usados** ou o navegador bloqueia o recurso sem avisar.

## 6. Acessos que precisam ser repassados

| Acesso | Onde / observação |
|---|---|
| **Repositório Git** | https://github.com/Letsprogramer/Dr_carlos — transferir para uma conta/org do cliente **ou** adicionar o novo dev em Settings → Collaborators. |
| **Hospedagem** | Conta Vercel/Cloudflare Pages criada com o e‑mail do cliente. Repassar o login (idealmente o cliente troca a senha e ativa 2FA). |
| **Domínio** | `souzacamposadvise.com.br` — registrador (provavelmente registro.br) e login. É onde se troca o DNS para apontar da VPS antiga para o novo host. |
| **Google Search Console** | Há verificação no `index.html` (`google-site-verification`). Repassar a propriedade / conta Google. |
| **Analytics** | Nenhum instalado no código no momento. |
| **Contatos do cliente** | WhatsApp `+55 19 99251-6000`, Instagram `@ctcs.adv` (usados em links no site). |
| **Imagens do hero/áreas** | Capas hoje vêm do CDN do Unsplash (hotlink). Ideal: baixar para `public/` e servir localmente (some da CSP também). |

## 7. Versionamento

- **Remote:** `origin` → https://github.com/Letsprogramer/Dr_carlos.git · **Branch:** `main`
- `.gitignore` exclui `node_modules/`, `dist/`, `.env*` e `.vercel/`.
- `.gitattributes` força LF em `.sh`/`.conf`.
- **Não** commitar `.env.local` nem `.vercel/`.

## 8. Roteiro de migração (tirar da VPS atual)

1. [ ] Criar a conta de hospedagem no nome do cliente (seção 4A/4B).
2. [ ] Conectar o repositório e fazer o primeiro deploy — testar na URL provisória
       (`*.vercel.app` / `*.pages.dev`).
3. [ ] Conferir cabeçalhos na URL provisória: https://securityheaders.com.
4. [ ] Adicionar o domínio no novo host e **trocar o DNS** no registrador
       (registro A/CNAME conforme o host indicar). Aguardar propagação.
5. [ ] Confirmar `https://souzacamposadvise.com.br` servindo pelo novo host, com HTTPS válido.
6. [ ] **Desativar na VPS antiga:** remover os arquivos do site, remover o `server{}`
       do nginx, `sudo certbot delete --cert-name souzacamposadvise.com.br`,
       `sudo systemctl reload nginx`.
7. [ ] Repassar os acessos da seção 6 ao cliente / novo dev.
8. [ ] Remover seus próprios acessos após a confirmação.
