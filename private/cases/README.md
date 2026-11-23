# Conteúdo de cases protegidos

Os diretórios demo-aurora e demo-orbita contêm apenas material fictício histórico.
Não estão registrados na aplicação e não são incluídos pelos traces de produção.
Os cases reais permanecem ignorados. Use estes arquivos no desenvolvimento e no
script de upload privado; produção usa Blob Private e exclui esta pasta dos traces.

Somente a camada projects/server/media-storage.mjs lê as mídias locais, após a
rota validar a sessão do slug. Imagens e downloads usam a rota privada autorizada;
não use imports estáticos nem next/image com cache compartilhado para eles.

Consulte o README da raiz para cadastro, hashes, variáveis, limites de tentativas
e requisitos de deploy. Não coloque senhas ou hashes nestes diretórios.

## YouRH

Rota: `/cases/educacao-corporativa`. Configure `CASE_YOURH_HASH` com uma senha
exclusiva, gerando o hash com `npm.cmd run hash:password` para `.env.local`
ou `npm.cmd run hash:password -- --raw` para o painel de hospedagem.
Preserve a chave de sessão e as configurações existentes de origem e Redis.
Sem o hash, o case permanece fechado.

Mantenha `private/cases/educacao-corporativa/` localmente: seis arquivos
`video-educorp-01.mp4` até `video-educorp-04.mp4`, `video-educorporativa-07.mp4`
e `video-educorporativa-08.mp4`, seis posters correspondentes
(mesmo nome do MP4 com o sufixo `-poster.png`) e dez SVGs
do Figma (`imgSearch`, `imgCirclePlay`, `imgBookOpen`, `imgUsers`, `imgBook`,
`imgBookMarked`, `imgShieldCheck`, `imgArrow1`, `imgArrow2`, `imgArrow3`).
Os nomes dos MP4s anexados foram mantidos. Os posters são quadros estáticos
das animações do Figma; o primeiro contém a tela interna, pois o fundo e
o espaçamento externos são aplicados pelo layout. Os demais mantêm o quadro inteiro.
Os arquivos são ignorados pelo Git e excluídos do tracing. O script
`npm run media:upload -- --dry-run` prepara a migração para Blob privado sem upload.
O deploy por Git usa os objetos privados, após seu provisionamento autorizado.
O conteúdo narrativo é `server-only` e só é carregado após autorização.

## Bluedesk


O slug é `contratacao-audiovisual`, com acesso protegido. O conteúdo narrativo
fica em `projects/server/bluedesk.tsx` (server-only), carregado apenas depois da
autorização. As mídias permanecem neste diretório privado e são ignoradas pelo Git.

Mantenha `private/cases/contratacao-audiovisual/` localmente com:

- `img-filmmaker-01.png`, `img-filmmaker-02.png`, `img-filmmaker-03.png`;
- `video-filmmaker-01.mp4`, `video-filmmaker-02.mp4`;
- `video-filmmaker-01-poster.png`, `video-filmmaker-02-poster.png`.

Os posters são quadros estáticos das animações do Figma, utilizados para a
preferência de movimento reduzido. Os cinco anexos mantêm seus nomes originais.
A camada local faz streaming em desenvolvimento; produção usa Blob privado,
sem incluir estas mídias no pacote de servidor.

Configure `CASE_BLUEDESK_HASH` com um hash produzido por `npm run hash:password`
(`npm.cmd run hash:password` no PowerShell com execução de scripts desativada).
Use a saída escapada no arquivo `.env.local`; no painel de hospedagem, gere com
`npm run hash:password -- --raw`. Preserve `CASE_SESSION_SECRET` e as demais
configurações existentes de origem e rate limiter. Sem o hash, o case permanece
fechado. Nenhuma senha definitiva foi criada por esta implementação.
