# Portfólio — preparação para produção

Next.js App Router com Home, Sobre mim e dois cases protegidos por senhas
independentes: Bluedesk (`/cases/contratacao-audiovisual`) e YouRH
(`/cases/educacao-corporativa`). Aurora, Órbita e `demo-publico` estão desativados,
inclusive por URL direta e cookies antigos. Seus arquivos históricos não são
incluídos nos pacotes de servidor.

## Desenvolvimento local

Use Node.js **24.x**, definido em `package.json` e `.nvmrc`, e instale com `npm ci`.
O lockfile está versionado. No PowerShell, use `npm.cmd` se a política impedir `npm`.

```sh
npm run setup:local
npm run dev
```

`setup:local` cria `.env.local` com hashes scrypt exclusivos de Bluedesk/YouRH e
uma chave de sessão aleatória. As senhas são exibidas apenas no terminal; guarde-as
em um gerenciador. O script nunca sobrescreve um arquivo existente. Se já tiver
`.env.local`, mantenha suas credenciais e compare apenas os nomes com `.env.example`.

As mídias locais permanecem em `private/cases/contratacao-audiovisual` e
`private/cases/educacao-corporativa`, ignoradas pelo Git. Nenhum arquivo desses
diretórios deve ir para `public`. É necessário tê-los localmente para a validação
HTTP completa e para preparar o futuro upload. Não há upload durante build/dev.

## Variáveis de ambiente

Todas as credenciais são exclusivas do servidor, sem prefixo `NEXT_PUBLIC_`.
Use valores separados para Production e Preview. Não copie os valores de exemplo
locais para o painel de hospedagem sem revisar a finalidade.

| Variável | Configuração |
| --- | --- |
| `CASE_SESSION_SECRET` | Pelo menos 32 bytes aleatórios em base64url; igual em todas as instâncias do ambiente. Também assina identificadores de rede no Redis. |
| `CASE_BLUEDESK_HASH` | Hash scrypt exclusivo do Bluedesk. |
| `CASE_YOURH_HASH` | Hash scrypt exclusivo do YouRH. |
| `SITE_URL` | Origem canônica HTTPS de produção, sem barra final. Configure antes do build para canonical, Open Graph e Twitter. Na Vercel pode usar o fallback `VERCEL_PROJECT_PRODUCTION_URL`. |
| `CASE_ALLOWED_ORIGIN` | Origem local exata, por exemplo `http://localhost:3000`; fallback explícito para Production quando `SITE_URL` estiver ausente. HTTPS obrigatório em produção. |
| `CASE_PREVIEW_ORIGIN` | Opcional: uma origem HTTPS exata para domínio personalizado de Preview. |
| `UPSTASH_REDIS_REST_URL` | Endpoint HTTPS do Redis REST. |
| `UPSTASH_REDIS_REST_TOKEN` | Token privado com permissão de EVAL, GET, INCR, EXPIRE e TTL. |
| `CASE_RATE_LIMIT_NAMESPACE` | Prefixo de 1–64 letras, números, `_` ou `-`, estável por ambiente e igual entre instâncias. Separe Production/Preview. |
| `CASE_RATE_LIMIT_MODE` | `local` somente no desenvolvimento; nunca cria fallback em produção. |
| `CASE_MEDIA_STORAGE` | Vazio seleciona automaticamente filesystem em desenvolvimento e Blob privado em produção. `blob` permite testar Blob durante desenvolvimento. `local` é recusado em Production/Preview. |
| `CASE_BLOB_PREFIX` | Prefixo estável dos objetos, padrão `cases/v1`. Mesmo valor no upload e no servidor; sem barra final. |
| `BLOB_READ_WRITE_TOKEN` | Token do store **Private**, para execução fora da Vercel ou autenticação estática quando OIDC não estiver disponível. Nunca enviar ao navegador. |

Na Vercel, habilite as variáveis de sistema e conecte um store **Private** ao
projeto e aos ambientes desejados. O SDK oficial aceita autenticação OIDC com
`BLOB_STORE_ID` e `VERCEL_OIDC_TOKEN`, gerenciados pela plataforma, ou token de
leitura/escrita. Não grave tokens OIDC em arquivos nem os mantenha manualmente:
são temporários. Não configure um store Public, URLs assinadas ou tokens de cliente.

Gere hashes com entrada oculta:

```sh
npm run hash:password
```

Essa saída usa `\$` para `.env.local`, pois o Next expande `$VAR`. Para o painel
da Vercel, use a saída sem escapes de `npm run hash:password -- --raw` e cole sem
aspas. Use senhas aleatórias, longas e diferentes para cada case.

## Origens, sessões e proteção contra abuso

Production aceita somente a origem HTTPS exata de `SITE_URL`, com fallback
documentado acima. Preview aceita os endereços exatos das variáveis confiáveis
`VERCEL_URL` e `VERCEL_BRANCH_URL`, mais `CASE_PREVIEW_ORIGIN` se configurada.
Não existe wildcard `*.vercel.app`, nem confiança em `Host`, `X-Forwarded-Host`
ou no próprio `Origin` para definir a lista permitida. Uma configuração inválida
falha fechada. Canonical e compartilhamento apontam para Production; Preview
recebe `noindex`. A origem pública precisa estar configurada antes do build.

Cookies individuais por slug usam HttpOnly, Secure em produção, SameSite=Lax,
prefixo `__Host-`, Path=/ e validade de 24 horas. HMAC vincula a sessão à senha
do case. Trocar um hash revoga as sessões daquele case; trocar a chave de sessão
revoga todas. Não há alteração de autenticação por usuário ou banco de sessões.

O rate limiter aplica atomicamente, em um único EVAL Redis:

- 20 tentativas por **case e rede** em 15 minutos;
- teto agregado de 500 tentativas por case em 15 minutos.

Tentativas admitidas consomem ambos os orçamentos, incluindo acertos. Uma rede já
bloqueada não consome o teto agregado. IPv4 usa o endereço individual; IPv6 agrupa
por /64, normalizando endereços equivalentes e IPv4 mapeado. A chave de rede é um
HMAC, sem IP em texto puro no Redis. Pessoas atrás do mesmo NAT ainda compartilham
o orçamento da rede; um ataque distribuído ainda pode atingir o teto agregado.
WAF e monitoramento continuam recomendados.

Somente `x-vercel-forwarded-for` é aceito como identidade de rede quando a
execução é identificada pelo ambiente da Vercel. Não há fallback para
`X-Forwarded-For`, `X-Real-IP` ou cookies controláveis pelo visitante. Sem IP
válido, configuração Redis, resposta íntegra ou serviço disponível, novos
desbloqueios retornam 503 sem cookie. Produção fora da Vercel exige implementar
um adaptador explícito de rede confiável. Sessões existentes continuam válidas
durante uma indisponibilidade do Redis.

## Mídias privadas e streaming

As URLs continuam `/api/cases/[slug]/files/[filename]`. A rota autoriza o cookie
do case e consulta uma allowlist **antes de construir o armazenamento, consultar
metadados ou ler bytes**. O manifesto compartilhado pelo servidor e pelo script
está em `projects/server/private-media-manifest.mjs`; parâmetros de URL nunca
viram caminhos arbitrários no filesystem ou no Blob.

`media-storage.mjs` centraliza os adaptadores. No desenvolvimento usa
`createReadStream` e verificação de caminhos reais. Em produção usa `head()` e
`get()` de `@vercel/blob` **2.9.0**, com `access: 'private'`, `useCache: false`,
stream e headers oficialmente suportados pelo SDK. A rota não carrega vídeos
inteiros em Buffer e não redireciona para o Blob. URLs privadas, tokens, ETags
internos e mensagens do SDK não entram na resposta ao visitante.

GET suporta intervalo único fechado, aberto (`bytes=100-`) e sufixo
(`bytes=-100`), retornando 206 e Content-Range/Content-Length correspondentes.
Intervalos inválidos, vazios ou múltiplos retornam 416 com `bytes */tamanho`.
Intervalos que ultrapassam o fim são ajustados. HEAD retorna os mesmos metadados
do arquivo inteiro, sem abrir stream; Range é ignorado em HEAD conforme HTTP.
If-Range incompatível resulta em GET completo. Não há respostas 304 autenticadas.

O adaptador confere ETag e o intervalo realmente recebido do upstream; se o Blob
ignorar Range ou o objeto mudar entre head/get, falha fechado com 503. O SDK
normaliza o status upstream para 200: por isso a conferência usa Content-Range.
Cancelamento e backpressure são preservados. Erros de stream depois de enviados
os headers interrompem a transferência; o navegador pode precisar tentar novamente.

Todas as respostas privadas, inclusive erros e HEAD, mantêm `no-store` para
navegador e CDNs, Vary: Cookie, nosniff e política de mesma origem. Apenas headers
selecionados pela aplicação são enviados; headers de cache do Blob não são
repassados. SVGs mantêm CSP sandbox. Não usar o otimizador compartilhado
`next/image` para mídias protegidas nem adicionar cache de CDN/service worker.

Os arquivos locais são excluídos dos traces do Next. O deploy pelo GitHub não
precisa recebê-los: o servidor usa os objetos privados previamente provisionados.
Não existe fallback para disco quando Blob falha. Para executar os testes locais
com `next start`, a suíte simula explicitamente `VERCEL_ENV=development`; essa
configuração não deve ser aplicada a deployments Production/Preview.

## Script de upload privado — preparado, ainda não executado

```sh
npm run media:upload -- --dry-run
```

O padrão também é simulação, sem `--execute`. Ela verifica os arquivos da
allowlist e calcula SHA-256 em streaming; não importa o SDK nem faz chamadas
remotas. Arquivos extras, demonstrativos e conteúdo fora do registro são ignorados.
O plano atual contém 29 arquivos. Nenhuma URL privada é salva em manifestos.

Quando houver autorização específica para fazer upload, forneça as credenciais
por ambiente seguro e use `npm run media:upload -- --execute`. Esse comando é
documentação para a próxima operação; **não foi executado nesta preparação**.
O script não carrega `.env.local` automaticamente, evitando uso acidental de
credenciais de outro ambiente.

Objetos têm caminhos determinísticos `cases/v1/<slug>/<arquivo>`. Antes de
escrever, o script consulta os objetos existentes e compara tamanho e SHA-256
dos bytes remotos. Objetos idênticos são pulados; conflitos ou erros de permissão
interrompem a operação. Usa `put` privado, multipart, sem sufixo aleatório e sem
sobrescrita. Verifica o conteúdo após cada envio. Uma execução interrompida pode
deixar apenas parte dos objetos novos; a repetição é idempotente. Não altere os
arquivos locais durante a execução. Atualizações de mídia exigem uma migração
deliberada de prefixo/objetos, pois este script não sobrescreve nem apaga arquivos.

## Verificação e pendências antes da publicação

```sh
npm run lint
npm test
npm run build
npm run test:integration
```

`npm run check` executa essa sequência. Os testes de segurança cobrem senhas,
sessões, origens e rede confiável. As suítes de mídia e upload usam armazenamento
simulado: GET/HEAD/Range, 200/206/416, streaming, cancelamento, autorização antes
de I/O, falhas fechadas, proteção de caminhos e idempotência. A integração inicia
instâncias locais do build de produção, com credenciais efêmeras, mídias locais e
emulador Redis; não altera `.env.local`. Os testes não fazem upload real.

O serviço Blob **real ainda precisa ser validado** em Preview: store Private,
autenticação OIDC/token, ETags, Range upstream, busca/seek em vídeos, HEAD,
cancelamento, MIME e ausência de cache compartilhado entre duas sessões.
Também falta validar Lua/TTL e limites em uma instância Upstash real.

Antes da publicação, configurar o domínio HTTPS, os ambientes, credenciais e
objetos privados. O projeto usa `next/font/google`: o build precisa alcançar
Google Fonts. O runtime Node precisa de memória para scrypt (cerca de 128 MiB
por verificação, além do Next) e concorrência adequada.

Next.js e `eslint-config-next` estão fixados em **16.4.6**. As dependências
transitivas de TypeScript ESLint foram atualizadas dentro das faixas compatíveis
(8.74.0, com minimatch 11.0.9), sem `npm audit fix --force`. O lockfile registra
essas versões. O `npm audit` após a instalação limpa não reportou vulnerabilidades.
O npm ainda avisa sobre o fim de suporte do ESLint 9; esse aviso de manutenção
não é um alerta de vulnerabilidade e uma futura migração de lint pode ser planejada
separadamente.

A instalação do SDK havia identificado uma versão vulnerável do Zod fixada por
`@vercel/cli-config`. O override restrito a essa dependência mantém Zod 4.6.6,
sem alterar outras versões do Zod nem reduzir a versão do SDK.

### Fontes

As fontes visuais compartilhadas já estão centralizadas em
`components/home/fonts.ts`: Outfit, Gabarito e Libre Baskerville. Geist e
Geist Mono são definidos uma única vez no layout raiz. Não há chamadas duplicadas
dos loaders por página. As definições foram preservadas: Libre Baskerville em
400, 500 e 600, nos estilos normal e itálico, com `display: swap`.

O erro de resolução da Libre Baskerville no build limpo deixou de ocorrer após
a atualização do Next.js para 16.4.6. Não foi necessário substituir a fonte nem
migrar para `next/font/local`. O build continua exigindo acesso a Google Fonts;
os visitantes recebem os arquivos otimizados do próprio site.

Os testes de navegador verificam o carregamento real dos seis pares peso/estilo
da Libre Baskerville, além da família, pesos e geometria dos títulos dos cases.

Referências oficiais: [Blob privado](https://vercel.com/docs/vercel-blob/private-storage),
[SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk),
[headers Vercel](https://vercel.com/docs/headers/request-headers) e
[variáveis de sistema](https://vercel.com/docs/environment-variables/system-environment-variables).
