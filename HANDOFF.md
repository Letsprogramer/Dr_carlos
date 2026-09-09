# Handoff — Site Souza Campos Advocacia

Documento de repasse para o próximo desenvolvedor.
O site é estático e vai ser hospedado numa **VPS** (nginx). Tudo o que é preciso
para subir está neste repositório.

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
| Servidor | nginx + Let's Encrypt/Certbot |

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
nginx.conf                          config do site  -> /etc/nginx/sites-available/...
deploy/deploy.sh                    build + rsync + reload nginx
deploy/nginx-security-headers.conf  cabeçalhos      -> /etc/nginx/snippets/...
```

### Editar conteúdo
- **Artigos do blog:** `src/data/blogPosts.js` — cada post tem `slug`, `seoTitle`,
  `seoDescription`, `cover`, `content` (array de blocos).
- **Áreas de atuação:** `src/data/areas.js`.
- **Textos da home:** `src/pages/Home.jsx`.
- **SEO por página:** hook `useSeo({...})` chamado dentro de cada página.
- **Sitemap:** `public/sitemap.xml` é manual — atualizar ao criar/remover páginas.

## 4. Subir o site numa VPS

Pré-requisitos no servidor: nginx, certbot (plugin nginx), Node só se for buildar lá
(o normal é buildar na máquina do dev e enviar só o `dist/`).

### 4.1 Primeira instalação

```bash
# no servidor, como root/sudo
# 1. snippet de cabeçalhos de segurança
sudo cp deploy/nginx-security-headers.conf /etc/nginx/snippets/souzacampos-security.conf

# 2. config do site (ajuste "root" dentro do arquivo se a pasta for outra)
sudo cp nginx.conf /etc/nginx/sites-available/souzacamposadvise.com.br
sudo ln -s /etc/nginx/sites-available/souzacamposadvise.com.br /etc/nginx/sites-enabled/

# 3. pasta do site
sudo mkdir -p /usr/share/nginx/html

# 4. certificado (DNS do domínio já precisa apontar para este servidor)
sudo certbot --nginx -d souzacamposadvise.com.br -d www.souzacamposadvise.com.br

# 5. testar e recarregar
sudo nginx -t && sudo systemctl reload nginx
```

### 4.2 Deploy do dia a dia

Da máquina do dev, na raiz do projeto:

```bash
SSH_HOST=usuario@IP-do-servidor ./deploy/deploy.sh
```

O script roda `npm ci && npm run build`, envia `dist/` com `rsync --delete` para
`REMOTE_PATH` (default `/usr/share/nginx/html`) e recarrega o nginx.
Variáveis aceitas: `SSH_HOST` (obrigatória), `REMOTE_PATH`, `SSH_PORT`.

> Sem `rsync` no Windows: rodar pelo Git Bash com rsync instalado ou pelo WSL; ou
> `npm run build` + enviar o conteúdo de `dist/` por `scp`/SFTP e recarregar o nginx.

### 4.3 Renovação do certificado

O Certbot renova sozinho (timer do systemd). Conferir: `sudo certbot renew --dry-run`.

## 5. Segurança

Ver [`SECURITY.md`](SECURITY.md). Os cabeçalhos (CSP, HSTS, X-Frame-Options, etc.)
ficam em [`deploy/nginx-security-headers.conf`](deploy/nginx-security-headers.conf).

**Ao adicionar recurso externo novo (analytics, pixel, CDN, iframe, fonte), atualize
a CSP nesse arquivo e reinstale o snippet no servidor**, senão o navegador bloqueia
o recurso sem avisar.

Detalhe do nginx: qualquer `add_header` dentro de um `location{}` cancela a herança
dos `add_header` do bloco pai — por isso o `nginx.conf` faz `include` do snippet
**dentro de cada `location`** que mexe em cabeçalho.

## 6. Acessos que precisam ser repassados

| Acesso | Onde / observação |
|---|---|
| **Repositório Git** | https://github.com/Letsprogramer/Dr_carlos — transferir para uma conta/org do cliente **ou** adicionar o novo dev em Settings → Collaborators. |
| **Domínio** | `souzacamposadvise.com.br` — registrador (provavelmente registro.br) e login. É onde o novo dev troca o registro **A** para o IP da VPS dele. |
| **Google Search Console** | Há verificação no `index.html` (`google-site-verification`). Transferir a propriedade / conta Google. |
| **Analytics** | Nenhum instalado no código no momento. |
| **Contatos do cliente** | WhatsApp `+55 19 99251-6000`, Instagram `@ctcs.adv` (usados em links no site). |
| **Imagens do hero/áreas** | Capas hoje vêm do CDN do Unsplash (hotlink). Ideal: baixar para `public/` e servir localmente (some da CSP também). |

## 7. Versionamento

- **Remote:** `origin` → https://github.com/Letsprogramer/Dr_carlos.git · **Branch:** `main`
- `.gitignore` exclui `node_modules/` e `dist/`. `.gitattributes` força LF em `.sh`/`.conf`.
- Não há credenciais no repositório.

## 8. Roteiro de migração (tirar da VPS atual)

1. [ ] Dar acesso ao repositório para o novo dev (transferir ou colaborador).
2. [ ] Novo dev sobe o site na VPS **dele** (seção 4) e testa pelo IP / domínio de teste.
3. [ ] Conferir cabeçalhos: https://securityheaders.com.
4. [ ] Trocar o registro **A** do domínio no registrador para o IP da nova VPS. Aguardar propagação.
5. [ ] Confirmar `https://souzacamposadvise.com.br` servindo pela nova VPS, com HTTPS válido.
6. [ ] **Desativar na VPS antiga:** remover os arquivos do site, remover o `server{}`
       do nginx, `sudo certbot delete --cert-name souzacamposadvise.com.br`,
       `sudo systemctl reload nginx`.
7. [ ] Repassar domínio e Google Search Console ao cliente / novo dev.
8. [ ] Remover seus próprios acessos após a confirmação.
