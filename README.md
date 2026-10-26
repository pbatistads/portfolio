# Portfólio: cases públicos e protegidos

Next.js App Router, sem login, usuários, CMS ou banco de projetos. O catálogo
público fica separado do conteúdo completo. Os dois cases protegidos são
inteiramente fictícios e têm imagens e notas próprias fora de `public`.

## Começar localmente

Requer Node.js compatível com o Next instalado (o projeto foi verificado com
Node 24). Após instalar as dependências:

```sh
npm run setup:demo
npm run dev
```

`setup:demo` cria `.env.local` com dois hashes scrypt independentes e uma chave
aleatória de assinatura. Exibe as duas senhas aleatórias **somente no terminal**,
para você guardar em um gerenciador. Nenhuma senha em texto puro é gravada ou
incluída no frontend. O script se recusa a sobrescrever `.env.local` existente.
Se ele já existir, configure manualmente usando `.env.example` e o gerador abaixo.
Não há senhas padrão no repositório.

Abra `http://localhost:3000`. Os cards da Home usam somente metadados públicos:

- `/cases/demo-aurora`: painel fictício de bem-estar, com imagem e notas Aurora.
- `/cases/demo-orbita`: planejamento fictício, com imagem e notas Órbita.
- `/cases/demo-publico`: exemplo público sem senha.

Teste em uma janela anônima: desbloqueie Aurora, atualize a página e confirme que
Órbita continua bloqueado. Abrir a URL de uma imagem sem o cookie do case retorna
401. O modo local usa um contador por processo **somente em desenvolvimento**;
reiniciar o servidor o limpa. Ele é ignorado em `next start`/produção.

## Estrutura

```text
app/
  page.tsx                              # Home existente + catálogo demonstrativo
  cases/[slug]/page.tsx                  # Gate ou renderização autorizada
  api/cases/[slug]/
    unlock/route.ts                     # POST de desbloqueio
    files/[filename]/route.ts           # GET/HEAD de arquivo autorizado
components/cases/
  case-layout.tsx                       # Preservado
  case-section.tsx                      # Preservado, usado pelos cases
  protected-case-gate.tsx               # Formulário reutilizável
projects/
  types.ts                              # Contrato público preservado
  catalog.ts                            # Somente metadados públicos
  content/public/
    index.ts                            # Registro dos cases públicos
    demo-publico.tsx
  server/
    authorization.ts                    # Configuração privada e verificação por slug
    private-registry.ts                 # Allowlist de cases e arquivos
    read-case.ts                        # Leitura pública ou protegida
    protected-cases.tsx                 # Autorização ANTES de ler conteúdo/arquivos
    passwords.mjs                       # Criptografia scrypt, também usada no CLI
    session-token.mjs                   # Assinatura e validade dos tokens
    rate-limit.ts                       # Orçamento compartilhado e falha fechada
    unlock-case.ts                      # Origem, limite, senha e emissão de cookie
private/cases/
  demo-aurora/{content.json,painel.svg,notas.txt}
  demo-orbita/{content.json,mapa.svg,notas.txt}
scripts/
  hash-password.mjs
  setup-demo.mjs
tests/
  security.test.mjs
  cases.integration.test.mjs
.env.example                            # Nomes das variáveis; sem segredos
```

Os módulos de acesso são `server-only`. Os dois módulos `.mjs` de primitivas
criptográficas são compartilhados apenas com scripts Node e testes; não devem
ser importados pelo catálogo ou por componentes clientes. As imagens SVG são
ilustrações geométricas locais fictícias, sem recursos externos ou scripts.

## Criar um novo case protegido

1. Adicione os metadados em `projects/catalog.ts`: slug único e estável, título,
   resumo, categorias, thumbnail pública genérica/aprovada e `access: "protected"`.
   Tudo nesse catálogo é público. Não coloque senha, hash, caminho privado ou
   descrição confidencial nele.
2. Crie `private/cases/meu-case/content.json`, imagens e arquivos necessários.
   Copie o formato de um demonstrativo: `sections` com `title` e `text`, `image`,
   `imageAlt` e `download`. Os nomes de arquivos devem existir no registro abaixo.
   O renderer reutiliza `CaseSection` e a rota aplica `CaseLayout`. Para layouts
   adicionais, componha os componentes visuais no servidor após a autorização.
3. Adicione uma entrada explícita em `projects/server/private-registry.ts`, com
   `passwordEnv: "CASE_MEU_CASE_HASH"`, `content: "meu-case/content.json"` e uma
   allowlist de arquivos: nome público do endpoint, caminho relativo a
   `private/cases`, MIME correto e `attachment`. O parâmetro da URL nunca é
   convertido diretamente em caminho no disco.
4. Gere uma senha longa e exclusiva e seu hash. Cadastre `CASE_MEU_CASE_HASH`
   somente no ambiente de servidor.
5. Acrescente os caminhos exatos do novo case a `outputFileTracingIncludes` em
   `next.config.ts`, para as rotas `/cases/*` e `/api/cases/*/files/*`. Provisione
   os arquivos privados no build de servidor. Casos reais continuam ignorados
   pelo Git: um deploy por Git não receberá esses arquivos automaticamente.
   Só os dois demonstrativos fictícios têm exceções no `.gitignore`.
6. Nunca registre um case protegido em `projects/content/public/index.ts` e nunca
   importe estaticamente suas imagens. Não copie conteúdo privado para `public`,
   nem publique a raiz do repositório ou `.next/server` como arquivos estáticos.

Para novos cases públicos, cadastre os metadados com `access: "public"`, crie um
componente `server-only` em `projects/content/public/` e registre seu loader no
Map de `index.ts`. O contrato dos metadados não muda.

## Gerar hashes e configurar o ambiente

```sh
npm run hash:password
```

Digite a senha no terminal; a entrada fica oculta. O script não recebe senhas por
argumento, para evitar o histórico do shell. Use pelo menos 12 caracteres; prefira
senhas aleatórias com 20 ou mais. O scrypt usa `N=131072`, `r=8`, `p=1`, salt de
16 bytes e resultado de 64 bytes, com comparação em tempo constante.

O comando imprime o hash com `\$`, pronto para colar em `.env.local`. Next.js
expande `$VAR` nos arquivos dotenv, por isso **não remova essas barras** nesse
arquivo. Não basta colocar aspas. Para Vercel e outros painéis de variáveis:

```sh
npm run hash:password -- --raw
```

Nesse caso, cole o valor sem barras e sem aspas no painel. Não coloque o hash
no código, em logs ou em variáveis `NEXT_PUBLIC_`. Nunca reutilize uma senha
entre cases. Não envie senhas reais por ferramentas de analytics/monitoramento.

| Variável privada | Finalidade |
| --- | --- |
| `CASE_SESSION_SECRET` | Chave aleatória de pelo menos 32 bytes, codificada como base64url; mesma chave em todas as instâncias do ambiente. |
| `CASE_DEMO_AURORA_HASH` | Hash scrypt exclusivo do Aurora. |
| `CASE_DEMO_ORBITA_HASH` | Hash scrypt exclusivo do Órbita. |
| `CASE_ALLOWED_ORIGIN` | Origem exata permitida para POST, sem barra final; ex.: `https://portfolio.exemplo.com`. Obrigatória em produção. |
| `UPSTASH_REDIS_REST_URL` | Endpoint HTTPS de um Redis REST compatível com Upstash. |
| `UPSTASH_REDIS_REST_TOKEN` | Token privado com permissão de EVAL, INCR, EXPIRE e TTL. |
| `CASE_RATE_LIMIT_NAMESPACE` | Prefixo estável de 1–64 letras, números, `_` ou `-`; igual em todas as instâncias/regiões do ambiente. |
| `CASE_RATE_LIMIT_MODE` | `local` apenas em desenvolvimento. Não habilita desbloqueios em produção. |

Para gerar a chave de assinatura:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Arquivos `.env*` privados permanecem ignorados; `.env.example` não contém valores.
A senha digitada pelo visitante vai do formulário ao servidor no corpo de POST,
sobre HTTPS em produção. Ela nunca é devolvida, embutida no HTML/JS ou armazenada
em localStorage. O navegador recebe apenas uma confirmação e o cookie HttpOnly;
o hash e a chave de assinatura nunca saem do servidor.

## Sessão, entrega privada e cache

Cada cookie é exclusivo de um slug. O token HMAC-SHA256 inclui slug, emissão,
expiração de 24 horas e nonce aleatório. Sua assinatura depende também do hash da
senha daquele case. Alterar o hash revoga as sessões do case; trocar a chave global
revoga todas. A validade é verificada a cada leitura, e não apenas no desbloqueio.
Não há flag de acesso controlável pelo navegador nem parâmetro `authorized`.

Cookies usam HttpOnly, SameSite=Lax, Path=/, sem Domain, Max-Age=86400 e Secure em
produção, com prefixo `__Host-`. São bearer tokens: um cookie roubado pode ser
reutilizado até expirar ou ocorrer uma rotação. Não há logout nem revogação
individual por visitante nesta solução sem banco de sessões.

A API verifica origem exata (proteção contra CSRF), tipo de conteúdo, orçamento
de tentativas, configuração e senha no servidor. Retorna 401 para senha incorreta,
403 para origem/tipo inválido, 413 para corpo acima de 4 KiB, 429 com Retry-After
para excesso e 503 quando dependências/configuração estão indisponíveis.

`readProtectedCase` e `readPrivateAsset` verificam a sessão **antes de qualquer
leitura de arquivo**. O endpoint de arquivos retorna 401 sem sessão, 404 para
arquivo fora da allowlist após autorização e 503 para falha de leitura. Ele
entrega bytes diretamente com no-store, nosniff, Vary: Cookie e CSP sandbox para
SVG. Não utiliza o otimizador `next/image`, evitando seu cache compartilhado.

As páginas protegidas não têm `generateStaticParams` nem `use cache`: consultam
cookies em cada requisição. Páginas e endpoints privados usam no-store também
para CDNs. O gate recebe apenas slug e título públicos; conteúdo completo não é
passado a componentes clientes antes da autorização. A Home desativa prefetch
nos links de cases. Após desbloquear, há uma recarga completa para descartar o
cache de navegação anterior. Metadados e previews de cases protegidos continuam
genéricos mesmo após desbloqueio, com noindex/nosnippet/noimageindex/noarchive.

Uma resposta RSC/prefetch anônima pode conter somente o gate ou ser vazia. Uma
página com gate é uma resposta normal, não uma entrega de conteúdo privado.
`notFound()` para slugs inexistentes pode transmitir a tela de não encontrado
com HTTP 200 já iniciado nesta versão do Next.js. A API de arquivos privados usa
status HTTP de erro reais. Não use status de página como autorização.

Um visitante autorizado pode copiar o que recebeu, incluindo imagens, downloads
e payloads RSC. Expirar o cookie não apaga conteúdo já visto ou salvo. Os testes
verificam o bloqueio de novas leituras e ausência de conteúdo nas respostas
anteriores ao desbloqueio.

## Limite de tentativas em produção

A dependência externa é um Redis REST compartilhado, compatível com
[Upstash REST](https://upstash.com/docs/redis/features/restapi). Não há SDK novo.
Um script Lua EVAL faz INCR/EXPIRE/TTL atomicamente. O orçamento é **20 tentativas
por case em uma janela de 15 minutos**, somando todos os visitantes e instâncias.
Todas as tentativas, inclusive bem-sucedidas, consomem orçamento.

O limite global por case evita depender de cabeçalhos IP que o cliente possa
forjar, e não pode ser contornado trocando IP. Em contrapartida, um atacante pode
esgotar temporariamente o orçamento para todos os visitantes daquele case.
Para maior disponibilidade, acrescente WAF/bot protection na borda e avalie uma
política adicional por origem confiável. Não substitua o orçamento compartilhado
por um Map em serverless. As sessões já emitidas continuam válidas durante uma
indisponibilidade do Redis, sem liberar novas tentativas de senha.

Sem URL, token, namespace válidos, ou em falha/timeout/resposta inválida do Redis,
o desbloqueio retorna 503 sem cookie. Em produção, `CASE_RATE_LIMIT_MODE=local`
não cria fallback. Endpoints remotos exigem HTTPS; HTTP em `127.0.0.1` existe
apenas para o emulador local dos testes.

## Antes de publicar na Vercel

- Configure os hashes exclusivos, a chave aleatória e a origem HTTPS exata nas
  variáveis **privadas** do ambiente correto. Não use chaves de teste nem hashes
  de senhas conhecidas. Configure previews separadamente: uma única origem por
  ambiente/deploy; outras origens são recusadas.
- Provisione o Redis compartilhado com namespace estável por ambiente, sem
  eviction/perda arbitrária das chaves da janela, e confirme EVAL e TTL. Não
  mude o namespace a cada instância/deploy se quiser preservar os limites ativos.
  Custos, quotas e disponibilidade desse serviço são dependências de produção.
- Use funções Node.js (o padrão deste projeto), com memória suficiente para
  scrypt, que utiliza cerca de 128 MiB por verificação, além do processo Next.
  Dimensione memória/concorrência e limites de execução; considere WAF para
  tráfego abusivo. Não mova esses endpoints para Edge Runtime.
- Inclua conteúdos e mídia no pacote **de servidor** usando o tracing configurado
  e o provisionamento dos arquivos ignorados. Confirme sua presença nos traces
  e ausência em assets públicos. Para dados reais, defina também como o CI acessa
  esses arquivos sem expô-los no repositório público ou nos logs.
- Não crie regras de CDN, proxy ou service worker que armazenem as respostas
  privadas. Não registre corpos de POST, Cookie/Set-Cookie ou variáveis secretas
  em analytics, APM ou logs. Mantenha HTTPS e revise alterações em componentes
  clientes para que não introduzam acesso ao registro privado.
- Execute build, lint, testes e um teste no ambiente de staging com o Redis real,
  duas sessões isoladas e URLs diretas dos arquivos. O emulador local não valida
  a infraestrutura real nem as políticas da CDN/Vercel.

## Verificação automática

```sh
npm test
npm run lint
npm run build
npm run test:integration
```

`test:integration` requer o build atual. Ele inicia três processos de produção em
portas locais temporárias: duas instâncias com configuração válida e outra sem
Redis. Usa senhas/chaves aleatórias efêmeras, sem criar ou alterar `.env.local`.
O Redis REST é emulado localmente para testar o contrato EVAL, o limite entre
instâncias e a falha fechada; não substitui um teste contra Redis real no staging.

A suíte verifica: case público; gate anônimo; senha errada/correta; isolamento
entre cases por senha e cookie; recarga e outra instância; expiração e adulteração;
imagens/downloads autorizados ou bloqueados; traversal; CSRF; cache anônimo após
acesso autorizado; metadados, RSC e prefetch; ausência de conteúdo/segredos em JS,
HTML/RSC estáticos; tracing de arquivos privados; 429 e 503 sem fallback local.
Os testes HTTP enviam cookies manualmente para simular sessões de produção em
loopback; não são automação de navegador nem auditoria visual/acessível completa.

O layout original usa `next/font/google`; o build precisa de acesso ao Google
Fonts quando as fontes não estiverem em cache.
