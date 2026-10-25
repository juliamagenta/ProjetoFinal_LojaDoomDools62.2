# Adicionar o site ao seu repositório

Repositório: https://github.com/juliamagenta/ProjetoFinal_LojaDoomDools62.2

## Colocar os arquivos na pasta certa

1. Extraia `Doomdolls_Site_Completo.zip`.
2. Copie todo o conteúdo extraído para a pasta do projeto que você abriu no VS Code e conectou ao GitHub.
3. Deixe `index.html`, `README.md`, `css`, `js`, `assets`, `docs`, `scripts` e `tests` diretamente nessa pasta. `assets` contém imagens, fonte e ícone.
4. Abra `index.html` no navegador ou use a extensão Live Server do VS Code.

Não é necessário instalar dependências para usar o site. `package.json`, `scripts` e `tests` servem para verificações opcionais com Node.js. Os arquivos `.cjs` da pasta `tests` são testes; o JavaScript do site está na pasta `js`.

## Conferir a conexão

No terminal da pasta do projeto:

```bash
git remote -v
git status
```

O endereço de `origin` deve terminar com `ProjetoFinal_LojaDoomDools62.2.git`. Se estiver apontando para outro repositório, atualize:

```bash
git remote set-url origin https://github.com/juliamagenta/ProjetoFinal_LojaDoomDools62.2.git
```

## Enviar com commits separados

Execute um comando por vez, depois de copiar os arquivos:

```bash
git add js/
git commit -m "Adiciona catalogo, carrinho, perfil e navegacao da loja"

git add css/
git commit -m "Adiciona estilos e layout responsivo da Doomdolls"

git add index.html
git commit -m "Adiciona estrutura HTML da loja"

git add assets/
git commit -m "Adiciona imagens das bonecas, logo, icone e fonte"

git add README.md docs/ .gitignore package.json scripts/ tests/
git commit -m "Adiciona documentacao e testes do projeto"

git branch -M main
git push -u origin main
```

Esses comandos criam commits reais no momento em que você os executa. Antes de enviar, confira os nomes dos arquivos com `git status` e, se desejar, veja os commits com `git log --oneline`.

Se o GitHub já tiver commits que não existem na pasta local, o envio pode ser recusado. Nesse caso, será necessário integrar o conteúdo existente antes de enviar; mantenha a mensagem de erro para orientar a resolução.

## Depois de publicar

Abra o repositório no GitHub e confira se os códigos, as pastas de imagens e o README apareceram. Para novas alterações no projeto:

```bash
git add .
git commit -m "Descreva a atualizacao realizada"
git push
```
