# Roteiro — Doomdolls

## O que apresentar

1. “A Doomdolls é uma loja de bonecas colecionáveis, com uma identidade em preto e cinza, ovelhas e laços.”
2. Mostre a página inicial, os destaques e as ofertas.
3. Abra o catálogo, pesquise Madeline, limpe a busca e use os filtros.
4. Abra Briar Beauty; mostre a descrição, a segunda foto e o zoom.
5. Adicione produtos ao carrinho, altere quantidades e remova um.
6. Calcule frete com `95600-000` e aplique `DOOM10`.
7. Finalize usando os dados fictícios de exemplo.
8. Demonstre débito à vista, crédito com parcelas e PIX de demonstração.
9. Confirme a compra e abra o acompanhamento.
10. Abra o perfil, entre na demonstração, altere a foto e salve contato e endereço. Recarregue para mostrar que os dados continuam salvos. Edite um campo e inicie outra compra para demonstrar o preenchimento automático. Mostre também o histórico.
11. Diminua a janela para mostrar o celular.
12. Abra os arquivos HTML, CSS e JavaScript.
13. Mostre o repositório GitHub e o histórico com `git log --oneline`.

## HTML

Em `index.html`, mostre `header`, `nav`, `main` e `footer`. O `main` recebe a página escolhida. As tags `link` e `script` conectam os arquivos separados.

O projeto usa um HTML principal com várias telas lógicas, identificadas pelo trecho `#` do endereço. Cada boneca tem uma rota própria e conteúdo próprio.

## CSS

Em `css/style.css`, mostre:

- `:root`: cores e medidas reutilizadas.
- `.product-grid`: organiza os cartões com Grid.
- `.header-inner`: alinha elementos com Flexbox.
- `@media (max-width: 600px)`: adapta o celular.
- `@font-face`: carrega a fonte do próprio projeto.
- `:focus-visible`: ajuda a navegar com o teclado.

## JavaScript: explique o carrinho e o total

Em `js/loja.js`, procure `subtotal` e `calcularTotais`.

“O carrinho guarda o identificador da boneca e sua quantidade. Para calcular o subtotal, o programa procura o preço no catálogo e multiplica pela quantidade. Se o cupom for DOOM10, desconta 10% dos produtos. Depois soma o frete. Os valores são guardados em centavos para evitar erros de arredondamento.”

Exemplo testado: 2 × R$ 329,90 = R$ 659,80. Cupom: R$ 65,98. Frete grátis porque o subtotal passou de R$ 600. Total: R$ 593,82, em 6 parcelas de R$ 98,97.

Em `js/app.js`, mostre `adicionar`, `salvarCarrinho` e os eventos de clique. Os atributos `data-action` e `data-id` identificam a ação e a boneca. O `localStorage` mantém os dados no mesmo navegador.

## JavaScript: perfil e fotos

Em `js/perfil.js`, `normalizar` mantém os campos conhecidos e trata perfis antigos; `atualizar` preserva os demais dados ao editar um campo. Em `js/app.js`, `salvarPerfil` valida os campos e salva no `localStorage`. A tela `checkout` lê esse mesmo objeto para preencher os dados da compra. A função `selecionarFotoPerfil` lê a imagem escolhida, reduz seu tamanho com canvas e prepara a prévia; a foto só é persistida ao salvar.

O catálogo em `js/produtos.js` tem uma lista `galeria` para cada boneca. O botão de cada miniatura informa o arquivo em `data-src`; a ação `photo` troca o `src` da imagem principal e destaca a miniatura escolhida.

## Pagamento e validação

O HTML marca campos obrigatórios e tipos de dados. O JavaScript valida CEP, telefone e dados básicos antes de gerar o pedido. A opção crédito mostra um `select` com parcelas. A função `parcelar` distribui os centavos restantes para manter a soma exata.

Não existe integração com banco. O PIX, o cartão e a aprovação são fictícios. A tela de entrada demonstra o fluxo; ela não autentica uma conta real e não guarda senha.

## Git

Git registra versões do projeto. GitHub hospeda o repositório. GitHub Pages pode publicar o site.

```bash
git log --oneline
git status
```

Os commits acompanham as etapas reais desta criação. Faça novos commits das modificações que você realizar. O projeto foi preparado com apoio do ChatGPT: pratique e compreenda as partes principais antes da aula.
