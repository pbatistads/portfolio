# Conteúdo reservado

Pasta reservada para futuros conteúdos completos e imagens de cases protegidos.
Os arquivos desta pasta (exceto este guia) são ignorados pelo Git e não são lidos
pela aplicação nesta etapa. Não adicione arquivos privados a `public`, nem os
importe em componentes, no catálogo público ou no registro de cases públicos.

A leitura futura deverá passar por `projects/server/protected-cases.ts`, com
autorização específica para o slug antes de ler qualquer arquivo. Imagens
privadas também precisarão de entrega autorizada; não usar URLs públicas nem
imports estáticos, que podem produzir arquivos em `/_next/static`.

Ignorar no Git não é controle de acesso nem estratégia de armazenamento em
produção. O provisionamento desses arquivos será definido com a autenticação.
