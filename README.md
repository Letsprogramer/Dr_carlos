# Site Souza Campos Advocacia

Site institucional estático — React 19 + Vite 8 + Tailwind CSS v4.
SPA com 3 rotas: `/`, `/blog`, `/blog/:slug`. Sem back-end.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview
npm run lint
```

## Deploy

VPS com nginx. Da raiz do projeto:

```bash
SSH_HOST=usuario@IP-do-servidor ./deploy/deploy.sh
```

Instalação do servidor, configuração de HTTPS, repasse de acessos e edição de
conteúdo: ver **[HANDOFF.md](HANDOFF.md)**.
Cabeçalhos de segurança e política de CSP: ver **[SECURITY.md](SECURITY.md)**.
