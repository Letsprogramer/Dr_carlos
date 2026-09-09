# Segurança

Site estático (SPA React + Vite), sem back-end, sem formulários, sem autenticação.
A superfície de ataque se resume ao conteúdo servido e aos cabeçalhos HTTP.

## Cabeçalhos aplicados

Produção é servidor próprio (nginx). Os cabeçalhos ficam em
[`deploy/nginx-security-headers.conf`](deploy/nginx-security-headers.conf)
(instalado como `/etc/nginx/snippets/souzacampos-security.conf`) e são espelhados
em [`vercel.json`](vercel.json), usado só no ambiente de preview da Vercel:

| Cabeçalho | Valor | Objetivo |
|---|---|---|
| `Content-Security-Policy` | ver abaixo | bloqueia XSS / injeção de recursos |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | força HTTPS |
| `X-Content-Type-Options` | `nosniff` | impede MIME sniffing |
| `X-Frame-Options` | `DENY` | anti-clickjacking (legado) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | limita vazamento de URL |
| `Permissions-Policy` | câmera/microfone/geo/pagamento/usb/topics desligados | reduz APIs sensíveis |
| `Cross-Origin-Opener-Policy` | `same-origin` | isola o contexto de navegação |

## Content-Security-Policy — allowlist atual

```
default-src 'self';
script-src  'self';
style-src   'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src    'self' https://fonts.gstatic.com;
img-src     'self' data: https://images.unsplash.com;
media-src   'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests
```

Domínios externos liberados e o motivo:

- `fonts.googleapis.com` / `fonts.gstatic.com` — Google Fonts (`@import` em `src/index.css`).
- `images.unsplash.com` — imagens de capa/áreas (`src/data/areas.js`, `src/data/blogPosts.js`).
- `'unsafe-inline'` em `style-src` — necessário por causa de `style={{ ... }}` inline em `src/pages/Home.jsx`.
  Não há `'unsafe-inline'` em `script-src`.

> **Ao adicionar um novo recurso externo** (CDN, script de analytics, pixel, iframe, fonte,
> API), atualize a CSP nos **dois** arquivos, senão o recurso será bloqueado silenciosamente
> pelo navegador.

Ideal futuro: hospedar as fontes localmente e mover as imagens do Unsplash para `/public`,
o que permite reduzir a CSP para `default-src 'self'` e remover o `'unsafe-inline'` de estilo.

## Segredos

- `.env.local` contém um `VERCEL_OIDC_TOKEN` gerado automaticamente pelo Vercel CLI.
  É de curta duração (~12 h) e já está coberto por `.gitignore` (`.env*`).
- Nunca commitar `.env*` nem `.vercel/`.
- Não há chaves de API no código do front-end.

## Verificação pós-deploy

```
curl -sI https://souzacamposadvise.com.br | grep -iE 'content-security|strict-transport|x-frame|x-content|referrer|permissions'
```

Ou usar https://securityheaders.com e https://observatory.mozilla.org.
