# Site Souza Campos Advocacia

Site institucional do escritório (Rio Claro/SP). Estático, sem back-end.
Domínio de produção: **https://souzacamposadvise.com.br**

> Novo no projeto? Este README cobre tudo para desenvolver e publicar.
> Para repasse de acessos (domínio, GitHub, Search Console) veja [HANDOFF.md](HANDOFF.md).
> Para cabeçalhos de segurança / CSP veja [SECURITY.md](SECURITY.md).

---

## 1. Stack

| Item | Valor |
|---|---|
| Framework | React 19 + Vite 8 |
| Estilo | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Rotas | `react-router-dom` v7 — SPA |
| Ícones | `lucide-react` |
| Lint | `oxlint` |
| Node | 20 ou superior (dev em v24) |
| Hospedagem | VPS com nginx + Let's Encrypt (Certbot) |

Sem back-end, banco, login ou formulários. O front **não usa variáveis de ambiente**
(`import.meta.env` não aparece no código). Contato do site é via links de WhatsApp
e Instagram.

## 2. Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/  (o que vai para o servidor)
npm run preview    # serve o dist/ para conferir o build
npm run lint
```

## 3. Estrutura do código

```
src/
  main.jsx            entrypoint
  App.jsx             rotas:  /   /blog   /blog/:slug
  pages/
    Home.jsx          página inicial (todos os textos da home estão aqui)
    Blog.jsx          listagem de artigos
    BlogPost.jsx      artigo individual (renderiza os blocos de conteúdo)
  components/          Header, Footer, WhatsAppButton, ArticleCard, icons/
  hooks/
    useSeo.js          injeta <title>, meta tags, Open Graph e JSON-LD por página
    useReveal.js        animação de "aparecer ao rolar"
  data/
    areas.js           áreas de atuação (título, texto, imagem)
    blogPosts.js        artigos do blog
  index.css            fonte (Google Fonts) + estilos base
index.html             <title> inicial, meta description, canonical,
                       google-site-verification
public/                favicons, logo-final.png, hero (vídeo/imagens),
                       robots.txt, sitemap.xml   -> copiado como-está para dist/
```

### Como editar conteúdo

| O quê | Onde |
|---|---|
| Texto da home, seções, chamadas | `src/pages/Home.jsx` |
| Áreas de atuação | `src/data/areas.js` |
| Artigos do blog | `src/data/blogPosts.js` |
| SEO de cada página (title/description/OG) | chamada de `useSeo({...})` dentro da página |
| `robots.txt` / `sitemap.xml` | `public/` — **sitemap é manual**, atualizar ao criar/remover páginas |
| Nº de WhatsApp / Instagram | busca por `wa.me` e `instagram.com` em `src/` |

Formato de um artigo em `blogPosts.js`:

```js
{
  slug: 'meu-artigo',
  category: 'Direito Empresarial',
  title: '...',
  seoTitle: '...',            // usado na aba do navegador / Google
  seoDescription: '...',
  dateISO: '2026-01-20',
  dateDisplay: '20 de janeiro de 2026',
  readTime: '5 min',
  cover: 'https://...',       // hoje vem do Unsplash (ver observação na seção 6)
  coverAlt: '...',
  content: [
    { type: 'h2', text: '...' },
    { type: 'p', text: '...' },
    { type: 'quote', text: '...' },
    { type: 'h3', text: '...' },
  ],
  relatedArea: { id: 'empresarial', label: 'Direito Empresarial' }, // opcional
}
```

## 4. Deploy (VPS + nginx)

Fluxo: **build na sua máquina → envia só o `dist/` por rsync/SSH → recarrega o nginx.**
Node não precisa estar no servidor.

### 4.1 Primeira instalação no servidor

DNS do domínio já deve apontar (registro **A**) para o IP da VPS antes do passo 4.

```bash
# como root/sudo, com o repo clonado na VPS ou os arquivos copiados

# 1. snippet dos cabeçalhos de segurança
sudo cp deploy/nginx-security-headers.conf /etc/nginx/snippets/souzacampos-security.conf

# 2. config do site  (confira o "root" dentro do arquivo — default /usr/share/nginx/html)
sudo cp nginx.conf /etc/nginx/sites-available/souzacamposadvise.com.br
sudo ln -s /etc/nginx/sites-available/souzacamposadvise.com.br /etc/nginx/sites-enabled/

# 3. pasta do site
sudo mkdir -p /usr/share/nginx/html

# 4. certificado HTTPS (renova sozinho depois)
sudo certbot --nginx -d souzacamposadvise.com.br -d www.souzacamposadvise.com.br

# 5. testar e aplicar
sudo nginx -t && sudo systemctl reload nginx
```

### 4.2 Publicar uma atualização

Da raiz do projeto, na sua máquina:

```bash
SSH_HOST=usuario@IP-da-VPS ./deploy/deploy.sh
```

O script faz `npm ci && npm run build`, `rsync --delete` de `dist/` para o servidor
e `systemctl reload nginx`.
Variáveis: `SSH_HOST` (obrigatória) · `REMOTE_PATH` (default `/usr/share/nginx/html`) ·
`SSH_PORT` (default 22).

Windows sem `rsync`: usar Git Bash (com rsync) ou WSL; ou `npm run build` e enviar o
conteúdo de `dist/` por `scp`/SFTP, depois `sudo systemctl reload nginx` no servidor.

### 4.3 Certificado

Renovação automática pelo timer do Certbot. Verificar: `sudo certbot renew --dry-run`.

## 5. Segurança

Detalhes em [SECURITY.md](SECURITY.md). Resumo:

- Cabeçalhos (CSP, HSTS, X-Frame-Options, etc.) em
  `deploy/nginx-security-headers.conf` → instalado em `/etc/nginx/snippets/`.
- A **CSP** só libera o necessário: Google Fonts e imagens do Unsplash. Ao adicionar
  qualquer recurso externo novo (analytics, pixel, iframe, CDN, fonte), **atualize a
  CSP nesse arquivo e reinstale o snippet**, senão o navegador bloqueia sem avisar.
- Regra do nginx: `add_header` dentro de um `location{}` cancela a herança dos
  `add_header` do bloco pai — por isso o `nginx.conf` inclui o snippet dentro de
  cada `location` que mexe em cabeçalho.
- Não há segredos no repositório. O único segredo do deploy é a chave SSH da VPS,
  que fica na máquina de quem publica.

Conferir em produção:

```bash
curl -sI https://souzacamposadvise.com.br | grep -iE 'content-security|strict-transport|x-frame|x-content|referrer|permissions'
```

Ou https://securityheaders.com.

## 6. Pontos de atenção / melhorias abertas

- **Imagens do hero e das áreas vêm do CDN do Unsplash por hotlink.** Frágil (podem
  sair do ar) e obrigam a CSP a liberar `images.unsplash.com`. Ideal: baixar para
  `public/` e trocar as URLs por caminhos locais — aí a CSP cai para `default-src 'self'`.
- **Fontes vêm do Google Fonts** (`@import` em `src/index.css`). Hospedar localmente
  remove mais duas entradas da CSP e o `'unsafe-inline'` de estilo.
- **`sitemap.xml` é manual.** Ao mexer nas rotas/artigos, atualizar.
- Sem testes automatizados e sem CI. `npm run lint` é a única verificação.

## 7. Comandos rápidos

| Ação | Comando |
|---|---|
| Desenvolver | `npm run dev` |
| Build de produção | `npm run build` |
| Conferir o build | `npm run preview` |
| Lint | `npm run lint` |
| Publicar | `SSH_HOST=usuario@IP ./deploy/deploy.sh` |
