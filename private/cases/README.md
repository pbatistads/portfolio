# Conteúdo de cases protegidos

Os diretórios demo-aurora e demo-orbita contêm apenas material fictício, com
exceções explícitas no .gitignore para possibilitar testes reproduzíveis.
Outros cases permanecem ignorados: provisione-os no build de servidor e configure
outputFileTracingIncludes sem copiar arquivos para public ou assets estáticos.

Somente projects/server/protected-cases.tsx lê estes arquivos, após validar a
sessão do slug. Imagens e downloads são entregues pela rota privada autorizada;
não use imports estáticos nem next/image com cache compartilhado para eles.

Consulte o README da raiz para cadastro, hashes, variáveis, limites de tentativas
e requisitos de deploy. Não coloque senhas ou hashes nestes diretórios.
