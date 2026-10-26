# Portfólio

Next.js App Router com catálogo público separado do conteúdo completo. A Home
original (`/`) foi preservada. Não há projetos reais cadastrados, autenticação,
banco de dados ou CMS.

## Estrutura

```text
app/
  page.tsx                     # Home existente
  layout.tsx
  globals.css
  cases/[slug]/page.tsx        # Case público ou 404
components/cases/
  case-layout.tsx              # Cabeçalho e estrutura visual compartilhados
  case-section.tsx             # Seções reutilizáveis, composição livre via children
projects/
  types.ts                     # Contrato dos metadados públicos
  catalog.ts                   # Catálogo único, pode ser usado pelo cliente
  content/public/
    index.ts                   # Registro explícito de loaders públicos, server-only
  server/
    read-case.ts               # Seleção por slug e tipo de acesso
    protected-cases.ts         # Leitura protegida desabilitada, server-only
private/cases/
  README.md                    # Reserva para conteúdo e mídia privados
public/                        # Apenas arquivos realmente públicos
```

## Cadastrar um projeto

1. Adicione em `projects/catalog.ts` um objeto do tipo `ProjectMetadata` com slug
   único e estável (ex.: `meu-projeto`), título, resumo, categorias, thumbnail
   pública (`src` e `alt`) e `access: "public"` ou `"protected"`.
   Todos esses campos são públicos, inclusive para cases protegidos: não inclua
   informação confidencial nem senhas. Use uma capa pública aprovada ou genérica.
2. Para um case público, crie `projects/content/public/meu-projeto.tsx`, iniciando
   com `import "server-only"`, e exporte o componente completo como `default`.
   Registre no Map de `projects/content/public/index.ts`:

   ```ts
   ["meu-projeto", () => import("./meu-projeto")]
   ```

   O endereço será `/cases/meu-projeto`. Se não houver loader, a rota retorna 404.
   Use `CaseSection` de `@/components/cases/case-section` para organizar o conteúdo;
   o layout compartilhado é aplicado pela rota. O componente do case pode compor
   textos, imagens públicas e componentes visuais livremente.
3. Para um case protegido, cadastre **somente os metadados públicos**. Não registre
   seu conteúdo em `content/public`. Arquivos reservados podem ficar em
   `private/cases/<slug>/`, ignorados pelo Git, sem importação pela aplicação.
   A rota retorna 404 e a camada de servidor retorna `null` sem ler nenhum arquivo.
   Nenhuma senha é criada ou aceita nesta etapa.

## Limites de segurança

`server-only` impede importação no cliente, mas não impede vazamentos por HTML,
props, payloads RSC ou prerenderização. Por isso, a leitura protegida está bloqueada
antes de qualquer carregamento e não retorna conteúdo. Não existe endpoint de
mídia privada, Server Action ou geração estática de cases protegidos. Os metadados
da rota usam apenas o catálogo público; cases bloqueados recebem título genérico
e `noindex`.

Não coloque conteúdo ou imagens privados em `public`, em imports estáticos de
imagens ou em `content/public`. Não reexporte módulos de servidor pelo catálogo.
A pasta `private` não é publicada pelo Next.js; ignorá-la no Git é apenas higiene
do repositório. Não publique a raiz do projeto como diretório estático.

Na etapa de autenticação será necessário verificar a autorização **para cada
slug**, com uma senha específica por projeto, dentro da camada de servidor antes
da leitura. A entrega de imagens privadas também precisará dessa verificação.
Os componentes visuais compartilhados poderão ser usados após a autorização.
Não remova o bloqueio atual apenas para exibir um formulário de senha.

## Desenvolvimento e verificações

```sh
npm run dev
npm run lint
npm run build
```

O layout existente usa `next/font/google`; o build precisa acessar o serviço de
fontes do Google se elas ainda não estiverem em cache.

Com Cache Components e transmissão de respostas habilitados na configuração
atual, `notFound()` pode renderizar a página de não encontrado em uma resposta
HTTP 200 já iniciada, com `noindex` e indicação de 404 no protocolo do Next.js.
Isso não libera conteúdo: a leitura protegida continua retornando `null` antes
de carregar arquivos. Não trate o status HTTP isolado como autorização.
