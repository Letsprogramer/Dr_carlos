# Handoff — Site Souza Campos Advocacia

Repasse do projeto para outro desenvolvedor. O site sai da VPS atual e vai para
uma VPS controlada pelo novo dev / cliente.

**Parte técnica** (stack, rodar, estrutura, deploy, segurança): ver [README.md](README.md).
Este documento cobre só o que é específico do repasse.

## Acessos a repassar

| Acesso | Observação |
|---|---|
| **Repositório Git** | https://github.com/Letsprogramer/Dr_carlos — transferir para uma conta/org do cliente **ou** adicionar o novo dev em Settings → Collaborators. |
| **Domínio** | `souzacamposadvise.com.br` — registrador (provavelmente registro.br) e login. É onde o novo dev troca o registro **A** para o IP da VPS dele. |
| **Google Search Console** | Existe verificação no `index.html` (`google-site-verification`). Transferir a propriedade / conta Google. |
| **Contatos do cliente** | WhatsApp `+55 19 99251-6000`, Instagram `@ctcs.adv` (aparecem em links no site). |
| **Analytics** | Nenhum instalado. |
| **VPS atual** | **Não** repassar — é compartilhada com outros projetos. O site é reinstalado do zero na VPS do novo dev (README seção 4). |

## Roteiro de migração

1. [ ] Dar acesso ao repositório ao novo dev (transferir ou colaborador).
2. [ ] Novo dev instala o site na VPS **dele** seguindo o README seção 4.1.
3. [ ] Testar pelo IP / domínio de teste antes de mexer no DNS.
4. [ ] Conferir cabeçalhos de segurança: https://securityheaders.com.
5. [ ] Trocar o registro **A** do domínio no registrador para o IP da nova VPS. Aguardar propagação (até algumas horas).
6. [ ] Confirmar `https://souzacamposadvise.com.br` servindo pela nova VPS, com cadeado válido.
7. [ ] **Desativar na VPS antiga:**
       - remover os arquivos do site (`/usr/share/nginx/html` ou onde estiver);
       - remover o `server{}` do nginx e o link em `sites-enabled/`;
       - `sudo certbot delete --cert-name souzacamposadvise.com.br`;
       - `sudo systemctl reload nginx`.
8. [ ] Repassar domínio e Google Search Console ao cliente / novo dev.
9. [ ] Remover os próprios acessos (colaborador no GitHub, etc.) após confirmação.

## Estado do repositório

- Remote `origin` → https://github.com/Letsprogramer/Dr_carlos.git · branch `main`
- Sem credenciais versionadas. `.gitignore` bloqueia `.env*`, `node_modules/`, `dist/`.
- Tudo que é preciso para hospedar está no repo: `nginx.conf`, `deploy/deploy.sh`,
  `deploy/nginx-security-headers.conf`.
