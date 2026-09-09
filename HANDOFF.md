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
| **Produção** | Servidor próprio (VPS) — nginx + Let's Encrypt/Certbot, deploy via rsync/SSH |
| Preview | Vercel (`project-y9w3u`) — era só para o cliente ver antes de publicar; pode ser desativado |

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
deploy/
  deploy.sh                    script de deploy (build + rsync + reload nginx)
  nginx-security-headers.conf  snippet -> /etc/nginx/snippets/souzacampos-security.conf
nginx.conf              config do site -> /etc/nginx/sites-available/...
```

### Editar conteúdo
- **Artigos do blog:** `src/data/blogPosts.js` — cada post tem `slug`, `seoTitle`,
  `seoDescription`, `cover`, `content` (array de blocos).
- **Áreas de atuação:** `src/data/areas.js`.
- **Textos da home:** `src/pages/Home.jsx`.
- **SEO por página:** hook `useSeo({...})` chamado dentro de cada página.
- **Sitemap:** `public/sitemap.xml` é manual — atualizar ao criar/remover páginas.

## 4. Deploy (produção = servidor próprio)

Fluxo: build local → envia `dist/` por rsync/SSH → recarrega o nginx.

### Primeira vez no servidor
1. Copiar o snippet de segurança:
   ```bash
   sudo cp deploy/nginx-security-headers.conf /etc/nginx/snippets/souzacampos-security.conf
   ```
2. Instalar a config do site:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/souzacamposadvise.com.br
   sudo ln -s /etc/nginx/sites-available/souzacamposadvise.com.br /etc/nginx/sites-enabled/
   ```
   Conferir o `root` no `nginx.conf` (hoje `/usr/share/nginx/html`).
3. Certificado (se ainda não existir):
   ```bash
   sudo certbot --nginx -d souzacamposadvise.com.br -d www.souzacamposadvise.com.br
   ```
4. Testar e recarregar: `sudo nginx -t && sudo systemctl reload nginx`

### Deploy do dia a dia
```bash
SSH_HOST=usuario@IP-do-servidor ./deploy/deploy.sh
```
O script roda `npm ci && npm run build`, faz `rsync --delete` de `dist/` para
`REMOTE_PATH` (default `/usr/share/nginx/html`) e recarrega o nginx.

> Sem rsync no Windows: rodar o script pelo Git Bash com rsync instalado, pelo WSL,
> ou fazer manualmente `npm run build` + enviar o conteúdo de `dist/` por `scp`/SFTP
> e depois `sudo systemctl reload nginx` no servidor.

### Renovação do certificado
O Certbot renova sozinho (timer do systemd). Conferir: `sudo certbot renew --dry-run`.

## 5. Segurança

Ver [`SECURITY.md`](SECURITY.md). Os cabeçalhos (CSP, HSTS, X-Frame-Options, etc.)
vivem em **dois lugares que precisam ficar em sincronia**:
- `deploy/nginx-security-headers.conf` → produção
- `vercel.json` → preview da Vercel (enquanto existir)

**Ao adicionar recurso externo novo (analytics, pixel, CDN, iframe, fonte), é
obrigatório atualizar a CSP nos dois arquivos** ou o navegador bloqueia sem avisar.

Detalhe do nginx: qualquer `add_header` dentro de um `location{}` cancela a herança
dos `add_header` do bloco pai — por isso o `nginx.conf` faz `include` do snippet de
segurança **dentro de cada `location`** que mexe em cabeçalho.

## 6. Acessos que precisam ser repassados

| Acesso | Onde / observação |
|---|---|
| **Servidor (SSH)** | IP/host, usuário, chave ou senha. Onde ficam os arquivos (`root` do nginx) e a config (`/etc/nginx/sites-available/...`). Provedor da VPS + login do painel. |
| **Domínio** | `souzacamposadvise.com.br` — registrador (provavelmente registro.br) e login. Conferir para onde o DNS (registro A) aponta: deve ser o IP do servidor. |
| **Certificado TLS** | Let's Encrypt via Certbot no servidor — renovação automática, nada a pagar. |
| **Repositório Git** | https://github.com/Letsprogramer/Dr_carlos — adicionar o novo dev em Settings → Collaborators. |
| **Google Search Console** | Há verificação no `index.html` (`google-site-verification`). Repassar a propriedade / conta Google. |
| **Vercel (opcional)** | Projeto `project-y9w3u`, time `team_yifUl39Cx9TSkpgNkqmFP36p`. Como produção saiu da Vercel, dá para **excluir o projeto** ou mantê-lo só como ambiente de preview. Se mantiver, adicionar o novo dev ao time. |
| **Analytics** | Nenhum instalado no código no momento. |
| **Contatos do cliente** | WhatsApp `+55 19 99251-6000`, Instagram `@ctcs.adv` (usados em links no site). |
| **Imagens do hero/áreas** | Capas hoje vêm do CDN do Unsplash (hotlink). Ideal: baixar para `public/` e servir localmente (some da CSP também). |

## 7. Versionamento

Repositório já criado e enviado:

- **Remote:** `origin` → https://github.com/Letsprogramer/Dr_carlos.git
- **Branch:** `main`
- `.gitignore` exclui `node_modules/`, `dist/`, `.env*` e `.vercel/`.
- **Não** commitar `.env.local` nem `.vercel/` (contêm dados da conta Vercel de quem fez o deploy).

Fluxo sugerido para o novo dev: branch por alteração → PR → merge em `main` → `./deploy/deploy.sh`.

## 8. Checklist de repasse

- [x] Repositório git criado e enviado (github.com/Letsprogramer/Dr_carlos)
- [ ] Novo dev adicionado como colaborador no GitHub
- [ ] Acesso SSH ao servidor repassado (host, usuário, chave)
- [ ] Provedor da VPS + painel repassados
- [ ] Domínio: registrador e DNS repassados (registro A → IP do servidor)
- [ ] Google Search Console repassado
- [ ] Projeto Vercel: excluído ou repassado (decidir)
- [ ] `npm install && npm run build` roda limpo na máquina do novo dev
- [ ] `./deploy/deploy.sh` publica com sucesso a partir da máquina do novo dev
- [ ] `sudo certbot renew --dry-run` OK no servidor
- [ ] Remover acessos antigos após confirmação
