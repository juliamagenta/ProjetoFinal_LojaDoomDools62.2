// Interface da loja. HTML + CSS + JavaScript puro, sem frameworks ou pagamentos reais.
(function () {
  'use strict';
  const $ = (seletor, pai = document) => pai.querySelector(seletor);
  const imagens = 'assets/images/';
  // Itens antigos permanecem identificáveis nos pedidos já salvos.
  const CATALOGO = PRODUTOS.filter(produto => produto.visivel !== false);
  const dinheiro = valor => (valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const escapar = texto => String(texto ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const produtoPorId = id => PRODUTOS.find(produto => produto.id === id);
  const apenasNumeros = texto => String(texto || '').replace(/\D/g, '');
  const formatarCep = texto => apenasNumeros(texto).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
  const icones = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    heart: '<path d="M20.8 5.2a5.5 5.5 0 0 0-7.8 0L12 6.3l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-9a5.5 5.5 0 0 0 0-7.8Z"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z"/>',
    star: '<path d="m12 2 2.9 6.3L22 9l-5.3 4.8 1.5 7.2-6.2-3.5L5.8 21l1.5-7.2L2 9l7.1-.7L12 2Z"/>',
    sparkle: '<path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z"/>',
    box: '<path d="m12 3 10 5-10 5L2 8l10-5ZM2 8v11l10 4 10-4V8M12 13v10M7 5.5l10 5"/>',
    truck: '<path d="M1 5h13v12H1V5Zm13 5h5l4 5v2h-9v-7Z"/><circle cx="6" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>',
    shield: '<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M5 16h5"/>',
    pix: '<path d="m12 2 5 5-5 5-5-5 5-5Zm0 10 5 5-5 5-5-5 5-5ZM2 12l5-5 5 5-5 5-5-5Zm10 0 5-5 5 5-5 5-5-5Z"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    tag: '<path d="M3 3h8l11 11-8 8L3 11V3Z"/><circle cx="7" cy="7" r="1"/>',
    zoom: '<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7M10 6v8M6 10h8"/>',
    leaf: '<path d="M20 3C8 1 2 7 5 15s16 5 15-12ZM4 21 17 7"/>',
    lock: '<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>'
  };
  const icone = nome => `<svg viewBox="0 0 24 24" aria-hidden="true">${icones[nome] || icones.sparkle}</svg>`;
  function preencherIcones(pai = document) {
    pai.querySelectorAll('[data-icon]').forEach(elemento => {
      if (!elemento.querySelector('svg')) elemento.insertAdjacentHTML('afterbegin', icone(elemento.dataset.icon));
    });
  }
  let armazenamentoDisponivel = true;
  function ler(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(`doomdolls:${chave}`)) ?? padrao; }
    catch { return padrao; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(`doomdolls:${chave}`, JSON.stringify(valor)); return true; }
    catch { armazenamentoDisponivel = false; return false; }
  }
  const favoritosLidos = ler('favoritos', []);
  const pedidosLidos = ler('pedidos', []);
  const perfilLido = ler('perfil', {});
  let carrinho = DoomCore.normalizarCarrinho(ler('carrinho', []), PRODUTOS);
  let favoritos = Array.isArray(favoritosLidos) ? [...new Set(favoritosLidos.filter(id => produtoPorId(id)))] : [];
  let pedidos = Array.isArray(pedidosLidos) ? pedidosLidos.filter(p => p && typeof p.id === 'string' && Array.isArray(p.itens) && Number.isFinite(p.total)) : [];
  let perfil = DoomPerfil.normalizar(perfilLido);
  let fotoPerfilPendente = perfil.foto;
  let processandoFoto = false;
  let versaoFoto = 0;
  let sessaoAtiva = ler('sessao', false) === true;
  let compraDireta = DoomCore.normalizarCarrinho(ler('compraDireta', []), PRODUTOS);
  let cupom = ler('cupom', '') === 'DOOM10' ? 'DOOM10' : '';
  let cep = typeof ler('cep', '') === 'string' ? ler('cep', '') : '';
  let quantidadeProduto = 1;
  let mensagemTemporaria;
  let finalizando = false;
  const conteudo = $('#conteudo');

  // Uma rota é o trecho depois do #. Isso permite abrir o projeto diretamente, sem servidor.
  function rotaAtual() {
    const hash = location.hash.slice(1) || 'inicio';
    const [caminho, consulta = ''] = hash.split('?');
    const partes = caminho.split('/');
    return { pagina: partes[0], id: partes[1] || '', parametros: new URLSearchParams(consulta) };
  }
  function urlCatalogo(alteracoes = {}) {
    const parametros = new URLSearchParams(rotaAtual().pagina === 'catalogo' ? rotaAtual().parametros : '');
    Object.entries(alteracoes).forEach(([chave, valor]) => valor ? parametros.set(chave, valor) : parametros.delete(chave));
    return `#catalogo${parametros.size ? '?' + parametros.toString() : ''}`;
  }
  function salvarCarrinho() {
    carrinho = DoomCore.normalizarCarrinho(carrinho, PRODUTOS);
    gravar('carrinho', carrinho);
    atualizarContador();
  }
  function atualizarContador() {
    const quantidade = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    const contador = $('#cart-count');
    contador.textContent = quantidade;
    contador.hidden = quantidade === 0;
    $('.cart-link').setAttribute('aria-label', `Carrinho com ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`);
  }
  function avisar(texto, link = '') {
    clearTimeout(mensagemTemporaria);
    const toast = $('#toast');
    toast.innerHTML = escapar(texto) + (link ? '<a href="#carrinho">Ver carrinho →</a>' : '');
    toast.hidden = false;
    mensagemTemporaria = setTimeout(() => { toast.hidden = true; }, 4300);
  }
  function caminho(trilhas) {
    return `<nav class="breadcrumb" aria-label="Caminho da página"><a href="#inicio">Início</a>${trilhas.map(t => `${icone('chevron')}${t.url ? `<a href="${t.url}">${escapar(t.nome)}</a>` : `<span aria-current="page">${escapar(t.nome)}</span>`}`).join('')}</nav>`;
  }
  function cabecalhoPagina(titulo, descricao, trilhas = [{ nome: titulo }]) {
    return `<div class="page-intro">${caminho(trilhas)}<h1>${escapar(titulo)}</h1>${descricao ? `<p>${escapar(descricao)}</p>` : ''}</div>`;
  }
  function lacinho() { return '<div class="bow-rule" aria-hidden="true"><img src="assets/icons/bow.svg" alt="" width="80" height="60"></div>'; }
  function vazio(titulo, texto, simbolo = 'bag', destino = '#catalogo', botao = 'Explorar a coleção') {
    return `<div class="empty-state"><span class="empty-icon">${icone(simbolo)}</span><h2>${escapar(titulo)}</h2><p>${escapar(texto)}</p><a class="button" href="${destino}">${escapar(botao)} ${icone('arrow')}</a></div>`;
  }
  function botaoFavorito(produto, classe = '') {
    return `<button class="icon-button favorite-button ${classe}" data-action="favorite" data-id="${produto.id}" aria-label="${favoritos.includes(produto.id) ? 'Remover dos' : 'Adicionar aos'} favoritos: ${produto.nome}" aria-pressed="${favoritos.includes(produto.id)}">${icone('heart')}</button>`;
  }
  function cartao(produto) {
    const promocao = produto.anterior && produto.anterior > produto.preco;
    const selo = promocao ? `−${Math.round((1 - produto.preco / produto.anterior) * 100)}%` : produto.novo ? 'Novidade' : produto.oferta ? 'Oferta' : '';
    return `<article class="product-card"><a href="#produto/${produto.id}" class="product-image" aria-label="Ver ${produto.nome}"><img src="${imagens + produto.imagem}" alt="Boneca ${produto.nome}, da coleção ${produto.colecao}" width="317" height="380" loading="lazy">${selo ? `<span class="tag card-tag">${selo}</span>` : ''}</a>${botaoFavorito(produto)}<div class="product-copy"><span class="category">${produto.colecao}</span><h3><a href="#produto/${produto.id}">${produto.nome}</a></h3><p class="short-description">${produto.descricao.split('. ')[0].replace(/[.!?]$/, '')}.</p><div class="price-line"><span class="price">${dinheiro(produto.preco)}</span>${promocao ? `<del>${dinheiro(produto.anterior)}</del>` : ''}</div><span class="installment">ou 6x de ${dinheiro(DoomCore.parcelar(produto.preco, 6)[0])} sem juros*</span><div class="card-actions"><a href="#produto/${produto.id}" class="button secondary">Ver detalhes ${icone('arrow')}</a><button class="add-mini" data-action="add" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">${icone('bag')}</button></div></div></article>`;
  }
  function capaColecao(tipo) {
    if (tipo === 'novidades') return `<div class="collection-cover collection-cover--novidades"><img src="assets/images/midia/banner-novidades.webp" width="975" height="182" alt="Acabaram de chegar: novas histórias para sua coleção, com ovelha, laços e botões"></div>`;
    return `<div class="collection-cover collection-cover--ofertas"><img src="assets/images/midia/banner-mulher-ovelha.webp" width="1600" height="800" alt="Mulher abraçando uma ovelha, em uma ilustração gótica"><div class="collection-cover-copy"><h2>Promoções</h2><p>Peças especiais para<br>a sua coleção.</p></div></div>`;
  }
  function inicio() {
    return `<div class="container"><section class="hero-wrap" aria-label="Descubra a Doomdolls"><div class="hero"><div class="hero-copy"><span class="eyebrow">Um refúgio para a sua coleção</span><h1>Descubra seu<br><em>lado secreto.</em></h1><p>Mais que bonecas, histórias que encontram um lugar especial na sua coleção.</p><a class="button" href="#catalogo">Explorar bonecas ${icone('arrow')}</a><span class="hero-note">${icone('heart')} Escolhidas com cuidado. Guardadas com afeto.</span></div><div class="hero-art"><img src="assets/images/midia/banner-mulher-ovelha.webp" alt="Ilustração gótica em cinza de uma menina abraçando uma ovelha de olhos de botão" width="1774" height="887" fetchpriority="high"><span class="art-label">O extraordinário mora nos detalhes.</span><img class="hero-bow" src="assets/icons/bow.svg" alt="" width="80" height="60"></div><div class="hero-marker" aria-hidden="true"><i></i><i></i><i></i></div></div><div class="collection-links"><a class="collection-link" href="#catalogo"><img class="collection-portrait" src="${imagens + produtoPorId('raven-queen').imagem}" width="56" height="64" alt="Raven Queen, imagem do atalho de Categorias"><span class="round-symbol">${icone('box')}</span><div><strong>Categorias</strong><small>Encontre seu universo</small></div><span class="end-arrow">${icone('arrow')}</span></a><a class="collection-link" href="#catalogo?filtro=novidades"><img class="collection-portrait" src="${imagens + produtoPorId('blythe-cabelo-preto').imagem}" width="56" height="64" alt="Blythe Noir, imagem do atalho de Novidades"><span class="round-symbol">${icone('sparkle')}</span><div><strong>Novidades</strong><small>Novas histórias chegaram</small></div><span class="end-arrow">${icone('arrow')}</span></a><a class="collection-link" href="#catalogo?filtro=ofertas"><img class="collection-portrait" src="${imagens + produtoPorId('lagoona-blue').imagem}" width="56" height="64" alt="Lagoona Blue, imagem do atalho de Ofertas"><span class="round-symbol">${icone('tag')}</span><div><strong>Ofertas</strong><small>Pequenos achados especiais</small></div><span class="end-arrow">${icone('arrow')}</span></a></div></section><section class="section" aria-labelledby="destaques"><div class="section-top"><div><span class="eyebrow">Para se apaixonar de novo</span><h2 id="destaques">Nossos destaques</h2><p>Peças especiais para histórias extraordinárias.</p></div><a href="#catalogo">Ver toda a coleção ${icone('arrow')}</a></div><div class="product-grid">${CATALOGO.filter(p => p.destaque).map(cartao).join('')}</div><div class="editorial-banner reference-offer">${capaColecao('ofertas')}<div class="banner-copy"><span class="eyebrow">Ofertas para sua coleção</span><h2>Pequenos achados especiais.</h2><p>Conheça nossos achados em oferta e use DOOM10 para ganhar 10% de desconto nos produtos.</p><a class="button secondary" href="#catalogo?filtro=ofertas">Descobrir ofertas ${icone('arrow')}</a></div></div></section><section class="values-grid" aria-label="O cuidado em cada detalhe"><article class="value"><span>${icone('heart')}</span><div><h3>Cada detalhe importa</h3><p>Uma coleção se constrói com afeto, memória e peças que combinam com você.</p></div></article><article class="value"><span>${icone('leaf')}</span><div><h3>Uma segunda história</h3><p>Explore personagens, reencontre favoritos e dê espaço a novas histórias.</p></div></article><article class="value"><span>${icone('box')}</span><div><h3>Da escolha à coleção</h3><p>Acompanhe cada etapa da sua experiência no seu próprio cantinho.</p></div></article></section><section class="quote">${lacinho()}<h2>Há um lugar para cada uma das suas histórias.</h2><p>Doomdolls · Colecione o extraordinário.</p></section></div>`;
  }
  function catalogo(parametros) {
    const categoria = parametros.get('categoria') || '';
    const filtro = parametros.get('filtro') || '';
    const busca = (parametros.get('busca') || '').slice(0, 80);
    const ordem = parametros.get('ordem') || 'destaques';
    const maximo = Number(parametros.get('preco')) || Infinity;
    const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let lista = CATALOGO.filter(p => (!categoria || p.colecao === categoria) && (filtro !== 'ofertas' || p.oferta || p.anterior > p.preco) && (filtro !== 'novidades' || p.novo) && p.preco <= maximo && normalizar(`${p.nome} ${p.colecao} ${p.descricao}`).includes(normalizar(busca)));
    if (ordem === 'menor') lista.sort((a, b) => a.preco - b.preco);
    if (ordem === 'maior') lista.sort((a, b) => b.preco - a.preco);
    if (ordem === 'nome') lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    const titulo = busca ? `Resultados para “${busca}”` : categoria || (filtro === 'novidades' ? 'Novas histórias chegaram.' : filtro === 'ofertas' ? 'Achados especiais.' : 'Encontre sua próxima história.');
    const categorias = [...new Set(CATALOGO.map(p => p.colecao))];
    const opcoes = (valores, selecionado) => valores.map(([valor, nome]) => `<option value="${valor}" ${valor === selecionado ? 'selected' : ''}>${nome}</option>`).join('');
    return `<div class="container">${cabecalhoPagina(titulo, 'Um universo de personagens, detalhes e memórias para colecionar.', [{ nome: 'Coleção' }])}${['ofertas','novidades'].includes(filtro) ? capaColecao(filtro) : ''}<div class="catalog-toolbar"><form class="catalog-search" id="catalog-search" role="search"><label class="sr-only" for="catalog-query">Pesquisar na coleção</label><input id="catalog-query" name="busca" type="search" value="${escapar(busca)}" maxlength="80" placeholder="Pesquisar boneca ou coleção…"><button class="icon-button" aria-label="Pesquisar">${icone('search')}</button></form><button class="catalog-filter-toggle" data-action="filters" aria-expanded="false" aria-controls="catalog-filters">${icone('filter')} Filtros</button><div class="sort"><label for="sort">Ordenar por</label><select id="sort">${opcoes([['destaques','Destaques'],['menor','Menor preço'],['maior','Maior preço'],['nome','Nome: A–Z']], ordem)}</select></div></div><div class="catalog-layout"><aside class="catalog-sidebar" id="catalog-filters" aria-label="Filtrar produtos"><section class="filter-panel"><h2>Coleções</h2><div class="filter-list"><a href="${urlCatalogo({categoria:''})}" class="${!categoria ? 'active' : ''}">Todas as bonecas <small>${CATALOGO.length}</small></a>${categorias.map(c => `<a href="${urlCatalogo({categoria:c})}" class="${categoria === c ? 'active' : ''}">${c} <small>${CATALOGO.filter(p => p.colecao === c).length}</small></a>`).join('')}</div></section><section class="filter-panel"><h2>Para descobrir</h2><div class="filter-list"><a href="${urlCatalogo({filtro:'novidades'})}" class="${filtro === 'novidades' ? 'active' : ''}">Novidades ${icone('sparkle')}</a><a href="${urlCatalogo({filtro:'ofertas'})}" class="${filtro === 'ofertas' ? 'active' : ''}">Ofertas ${icone('tag')}</a></div></section><section class="filter-panel"><label for="price-filter">Faixa de preço</label><select id="price-filter">${opcoes([['','Todos os preços'],['25000','Até R$ 250'],['35000','Até R$ 350'],['40000','Até R$ 400']], parametros.get('preco') || '')}</select></section><a class="text-button" href="#catalogo">Limpar filtros</a></aside><section aria-label="Produtos da coleção"><div class="result-line"><span>${lista.length} ${lista.length === 1 ? 'boneca encontrada' : 'bonecas encontradas'}</span>${categoria || filtro || busca || maximo !== Infinity ? '<a class="active-filter" href="#catalogo">Limpar filtros ×</a>' : '<span>Escolha com o coração.</span>'}</div><div class="product-grid">${lista.length ? lista.map(cartao).join('') : `<div class="catalog-empty">${vazio('Nenhuma boneca por aqui…','Tente outro nome ou remova os filtros para descobrir sua próxima favorita.','search','#catalogo','Ver todas as bonecas')}</div>`}</div></section></div></div>`;
  }
  function detalhes(id) {
    const produto = produtoPorId(id);
    if (!produto) return paginaNaoEncontrada();
    quantidadeProduto = 1;
    const galeria = produto.galeria || [produto.imagem];
    return `<div class="container"><div class="page-intro">${caminho([{nome:'Coleção',url:'#catalogo'},{nome:produto.nome}])}</div><section class="product-layout"><div class="gallery"><div class="gallery-main" id="gallery-main"><img id="main-photo" src="${imagens + produto.imagem}" alt="Boneca ${produto.nome}, vista principal" width="500" height="550">${botaoFavorito(produto)}<button class="icon-button zoom-button" data-action="zoom" aria-label="Ampliar foto" aria-pressed="false">${icone('zoom')}</button></div><div class="gallery-thumbs" aria-label="Fotos de ${produto.nome}">${galeria.map((foto, i) => `<button class="${i === 0 ? 'active' : ''}" data-action="photo" data-src="${foto}" data-id="${produto.id}" aria-label="Ver foto ${i + 1} de ${produto.nome}" aria-pressed="${i === 0}"><img src="${imagens + foto}" alt="" width="75" height="88"></button>`).join('')}</div><p class="inline-note">${galeria.length > 1 ? 'Selecione uma miniatura para ver outra foto. ' : ''}Use a lupa para observar os detalhes.</p></div><div class="product-detail"><span class="eyebrow">${produto.colecao}</span><span class="tag ${produto.novo ? '' : 'soft'}">${produto.novo ? 'Recém-chegada à coleção' : 'Uma das nossas favoritas'}</span><h1>${produto.nome}</h1><a class="rating" href="#avaliacoes"><span class="stars" aria-label="5 estrelas">★★★★★</span> ${produto.nota.toFixed(1).replace('.',',')} <span>(${produto.avaliacoes} avaliações demonstrativas)</span></a><div class="price-line"><span class="price">${dinheiro(produto.preco)}</span>${produto.anterior ? `<del>${dinheiro(produto.anterior)}</del>` : ''}</div><span class="installment">Em até 6x de ${dinheiro(DoomCore.parcelar(produto.preco,6)[0])} sem juros*</span><p class="product-description">${produto.descricao}</p><div class="product-stock">Disponível na simulação · ${produto.estoque} unidades</div><div class="buy-row"><div class="quantity"><button data-action="product-minus" aria-label="Diminuir quantidade">−</button><output id="product-quantity" aria-live="polite">1</output><button data-action="product-plus" data-id="${produto.id}" aria-label="Aumentar quantidade">+</button></div><button class="button" data-action="add-product" data-id="${produto.id}">${icone('bag')} Adicionar ao carrinho</button></div><button class="button secondary full" data-action="buy" data-id="${produto.id}">Comprar agora ${icone('arrow')}</button><div class="shipping-label">${icone('truck')} Calcular frete demonstrativo</div>${formularioFrete('product')}<p id="shipping-result" class="shipping-result" aria-live="polite">Frete grátis em compras a partir de R$ 600.</p><div class="divider"></div><details class="detail-accordion" open><summary>Os detalhes que encantam</summary><ul>${produto.detalhes.map(d => `<li>${d}</li>`).join('')}</ul></details><details class="detail-accordion"><summary>Envio e cuidados</summary><p>Guarde sua coleção longe do sol e da umidade. Use um pano macio e seco para tirar a poeira. O prazo e o frete exibidos são estimativas fictícias.</p></details><details class="detail-accordion" id="avaliacoes"><summary>Avaliações da coleção · ${produto.nota.toFixed(1).replace('.',',')}</summary><div class="rating-panel"><strong>${produto.nota.toFixed(1).replace('.',',')}</strong><div><span class="stars">★★★★★</span><p>${produto.avaliacoes} avaliações ilustrativas para este projeto escolar.</p></div></div></details><p class="inline-note">*As parcelas podem variar em R$ 0,01 para manter o valor total correto. Produtos, informações e estoque demonstrativos.</p></div></section><section class="related"><div class="section-top"><div><span class="eyebrow">Talvez seja amor à primeira vista</span><h2>Mais histórias para conhecer</h2></div></div><div class="product-grid">${CATALOGO.filter(p => p.id !== id).slice(0,4).map(cartao).join('')}</div></section></div>`;
  }
  function formularioFrete(contexto) {
    return `<form class="shipping-form" data-form="shipping" data-context="${contexto}"><label class="sr-only" for="cep-${contexto}">CEP para estimar o frete</label><input id="cep-${contexto}" name="cep" value="${escapar(formatarCep(cep))}" placeholder="00000-000" inputmode="numeric" maxlength="9" pattern="[0-9]{5}-?[0-9]{3}" required autocomplete="postal-code"><button class="button secondary small">Calcular</button></form>`;
  }
  function itensCompra(rota = rotaAtual()) { return rota.parametros.get('direta') === '1' ? compraDireta : carrinho; }
  function totaisCompra(itens) {
    const subtotal = DoomCore.subtotal(itens, PRODUTOS);
    const entrega = DoomCore.calcularFrete(cep, subtotal);
    return { ...DoomCore.calcularTotais(itens, PRODUTOS, cupom, entrega?.valor), calculado: Boolean(entrega) || subtotal >= DoomCore.FRETE_GRATIS };
  }
  function linhasTotais(totais) {
    return `<div class="summary-line"><span>Produtos</span><span>${dinheiro(totais.subtotal)}</span></div>${totais.desconto ? `<div class="summary-line discount"><span>Cupom DOOM10 (10%)</span><span>− ${dinheiro(totais.desconto)}</span></div>` : ''}<div class="summary-line"><span>Frete ${totais.calculado ? '' : 'estimado'}</span><span>${totais.calculado ? (totais.frete ? dinheiro(totais.frete) : 'Grátis') : 'Informe o CEP'}</span></div><div class="summary-total"><span>${totais.calculado ? 'Total' : 'Total parcial'}</span><strong>${dinheiro(totais.total)}</strong></div>`;
  }
  function telaCarrinho() {
    if (!carrinho.length) return `<div class="container">${cabecalhoPagina('Seu carrinho','Cada nova história começa com uma escolha.')}${vazio('Sua coleção espera por uma nova história.','Seu carrinho ainda está vazio. Que tal encontrar uma boneca que tem tudo a ver com você?')}</div>`;
    const totais = totaisCompra(carrinho);
    const falta = Math.max(0, DoomCore.FRETE_GRATIS - totais.subtotal);
    return `<div class="container">${cabecalhoPagina('Seu carrinho', 'Um lugar para guardar suas próximas histórias.')}<div class="purchase-layout"><div><div class="free-shipping">${falta ? `Faltam <strong>${dinheiro(falta)}</strong> em produtos para ganhar frete grátis.` : `${icone('check')} Seu pedido ganhou <strong>frete grátis</strong>.`}<div class="progress-bar" aria-hidden="true"><span style="width:${Math.min(100,totais.subtotal / DoomCore.FRETE_GRATIS * 100)}%"></span></div></div><div class="cart-items">${carrinho.map(item => { const p = produtoPorId(item.id); return `<article class="cart-item"><a href="#produto/${p.id}"><img src="${imagens + p.imagem}" width="91" height="110" alt="${p.nome}"></a><div><span class="category">${p.colecao}</span><h2><a href="#produto/${p.id}">${p.nome}</a></h2><span class="price">${dinheiro(p.preco)} <span class="muted">/ unidade</span></span><br><div class="quantity"><button data-action="cart-minus" data-id="${p.id}" aria-label="Diminuir quantidade de ${p.nome}" ${item.quantidade === 1 ? 'disabled' : ''}>−</button><output aria-label="Quantidade de ${p.nome}">${item.quantidade}</output><button data-action="cart-plus" data-id="${p.id}" aria-label="Aumentar quantidade de ${p.nome}" ${item.quantidade >= p.estoque ? 'disabled' : ''}>+</button></div></div><div class="item-price"><strong>${dinheiro(p.preco * item.quantidade)}</strong><button class="remove-item" data-action="remove" data-id="${p.id}">${icone('trash')} Remover</button></div></article>`; }).join('')}</div><div class="cart-extra"><section><h2>Seu CEP, sua entrega</h2>${formularioFrete('cart')}<p id="shipping-result" class="shipping-result" aria-live="polite">${totais.calculado ? `Entrega demonstrativa: ${totais.frete ? dinheiro(totais.frete) : 'grátis'} · 5 a 9 dias úteis.` : 'Informe o CEP para estimar o valor da entrega.'}</p></section><section><h2>Um carinho em forma de cupom</h2><form class="coupon-form" id="coupon-form"><label class="sr-only" for="coupon">Cupom de desconto</label><input id="coupon" name="cupom" placeholder="DOOM10" value="${cupom}" maxlength="20"><button class="button secondary small">Aplicar</button></form><p id="coupon-result" class="${cupom ? 'success-text' : 'inline-note'}" aria-live="polite">${cupom ? 'DOOM10 aplicado: 10% nos produtos. <button class="text-button" data-action="remove-coupon">Remover</button>' : 'Use DOOM10 para ganhar 10% de desconto nos produtos.'}</p></section></div><a class="text-button" href="#catalogo">← Continuar explorando a coleção</a></div><aside class="summary" aria-label="Resumo da compra"><h2>Resumo do pedido</h2>${linhasTotais(totais)}<a class="button full" href="#checkout">Finalizar compra ${icone('arrow')}</a><p class="summary-note">${icone('lock')} Ambiente de compra demonstrativo</p></aside></div></div>`;
  }
  function miniItens(itens) {
    return itens.map(item => {const p = produtoPorId(item.id); return `<div class="checkout-summary-item"><img src="${imagens + p.imagem}" alt="${p.nome}" width="41" height="49"><div><strong>${p.nome}</strong><small>Quantidade: ${item.quantidade}</small></div><span>${dinheiro(p.preco * item.quantidade)}</span></div>`;}).join('');
  }
  function campo(id, label, tipo = 'text', valor = '', extra = '', classe = '', obrigatorio = true) {
    return `<div class="field ${classe}"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${tipo}" value="${escapar(valor)}" ${obrigatorio ? 'required' : ''} ${extra}></div>`;
  }
  function campoEstado(id, valor = '', obrigatorio = false) {
    return `<div class="field"><label for="${id}">Estado</label><select id="${id}" name="${id}" ${obrigatorio ? 'required' : ''} autocomplete="address-level1"><option value="">Selecione</option>${DoomPerfil.estados.map(uf => `<option value="${uf}" ${valor === uf ? 'selected' : ''}>${uf}</option>`).join('')}</select></div>`;
  }
  function avatarPerfil(foto = perfil.foto) {
    const temFoto = DoomPerfil.fotoValida(foto);
    return `<div class="profile-avatar ${temFoto ? 'has-photo' : ''}" data-avatar-container><img data-avatar-preview src="${temFoto ? escapar(foto) : 'assets/icons/bow.svg'}" width="80" height="80" alt="${temFoto ? 'Foto de perfil' : 'Laço da Doomdolls'}"></div>`;
  }
  function atualizarPreviaAvatar(foto) {
    const temFoto = DoomPerfil.fotoValida(foto);
    document.querySelectorAll('[data-avatar-container]').forEach(elemento => elemento.classList.toggle('has-photo', temFoto));
    document.querySelectorAll('[data-avatar-preview]').forEach(imagem => {
      imagem.src = temFoto ? foto : 'assets/icons/bow.svg';
      imagem.alt = temFoto ? 'Foto de perfil' : 'Laço da Doomdolls';
    });
    const remover = $('#remove-avatar');
    if (remover) remover.hidden = !temFoto;
  }
  async function selecionarFotoPerfil(arquivo) {
    if (!arquivo) return;
    const mensagem = $('#profile-photo-message');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(arquivo.type)) {
      mensagem.textContent = 'Escolha uma imagem JPG, PNG ou WebP.'; return;
    }
    if (arquivo.size > 10 * 1024 * 1024) {
      mensagem.textContent = 'A imagem deve ter até 10 MB.'; return;
    }
    const tentativa = ++versaoFoto;
    processandoFoto = true;
    $('#save-profile').disabled = true;
    mensagem.textContent = 'Preparando sua foto…';
    try {
      const dados = await new Promise((resolver, rejeitar) => {
        const leitor = new FileReader();
        leitor.onload = () => resolver(leitor.result);
        leitor.onerror = () => rejeitar(new Error('Não foi possível ler a foto.'));
        leitor.readAsDataURL(arquivo);
      });
      const imagem = await new Promise((resolver, rejeitar) => {
        const foto = new Image();
        foto.onload = () => resolver(foto);
        foto.onerror = () => rejeitar(new Error('Não foi possível abrir essa imagem.'));
        foto.src = dados;
      });
      if (tentativa !== versaoFoto || !$('#profile-form')) return;
      // Reduz o arquivo para salvar a foto no navegador, sem deformar a proporção.
      const escala = Math.min(1, 512 / Math.max(imagem.naturalWidth, imagem.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(imagem.naturalWidth * escala));
      canvas.height = Math.max(1, Math.round(imagem.naturalHeight * escala));
      const contexto = canvas.getContext('2d');
      contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
      fotoPerfilPendente = canvas.toDataURL('image/webp', 0.88);
      atualizarPreviaAvatar(fotoPerfilPendente);
      mensagem.textContent = 'Foto selecionada. Salve as alterações para usá-la no seu perfil.';
    } catch (erro) {
      if ($('#profile-photo-message')) $('#profile-photo-message').textContent = erro.message || 'Não foi possível preparar a foto.';
    } finally {
      if (tentativa === versaoFoto) {
        processandoFoto = false;
        if ($('#save-profile')) $('#save-profile').disabled = false;
      }
    }
  }
  function salvarPerfil(formulario) {
    if (processandoFoto) return;
    const dados = new FormData(formulario);
    const alteracoes = Object.fromEntries(DoomPerfil.campos.map(campo => [campo, String(dados.get('perfil-' + campo) || '')]));
    const atualizado = DoomPerfil.atualizar(perfil, { ...alteracoes, foto: fotoPerfilPendente });
    const erro = DoomPerfil.validar(atualizado);
    if (erro) {
      $('#profile-message').textContent = erro.mensagem;
      $('#profile-message').className = 'error-text';
      $('#perfil-' + erro.campo).focus(); return;
    }
    if (!gravar('perfil', atualizado)) {
      $('#profile-message').textContent = 'Não foi possível salvar neste navegador. Tente uma foto menor ou libere espaço e salve novamente.';
      $('#profile-message').className = 'error-text'; return;
    }
    perfil = atualizado;
    cep = perfil.cep;
    gravar('cep', cep);
    renderizar(false);
    $('#profile-message').textContent = 'Foto e dados salvos. Suas próximas compras serão preenchidas automaticamente.';
    $('#profile-message').className = 'success-text';
    avisar('Seu perfil foi atualizado.');
  }
  function checkout() {
    const itens = itensCompra();
    if (!itens.length) return `<div class="container">${cabecalhoPagina('Finalizar pedido','')}${vazio('Escolha sua próxima história.','Adicione uma boneca ao carrinho para continuar a simulação.')}</div>`;
    if (perfil.cep) cep = perfil.cep;
    const totais = totaisCompra(itens);
    const direta = rotaAtual().parametros.get('direta') === '1';
    return `<div class="container">${cabecalhoPagina('Falta pouco para ser sua.','Vamos preparar a próxima história da sua coleção.',[{nome:'Carrinho',url:'#carrinho'},{nome:'Finalizar pedido'}])}<div class="notice">${icone('shield')}<span><strong>Esta é uma compra simulada.</strong> Use os dados fictícios de exemplo. Nenhum pagamento é realizado e nenhum dado bancário é solicitado.</span></div><div class="checkout-steps"><span>01 · Escolha</span><i></i><span class="current">02 · Dados e pagamento</span><i></i><span>03 · Confirmação</span></div>${direta ? '<p class="inline-note">Compra direta: os produtos que já estão no seu carrinho serão preservados.</p>' : ''}<div class="purchase-layout"><form id="checkout-form"><section class="checkout-card"><h2><span class="step-number">1</span> Quem vai receber?</h2><div class="sample-data"><button type="button" class="text-button" data-action="fill-demo">Preencher com dados fictícios de exemplo ${icone('arrow')}</button></div><div class="form-grid">${campo('nome','Nome completo','text',perfil.nome || '','minlength="3" maxlength="80" autocomplete="name"','span-2')}${campo('email','E-mail','email',perfil.email || '','maxlength="120" autocomplete="email"')}${campo('telefone','Telefone','tel',perfil.telefone || '','inputmode="tel" maxlength="16" pattern="[0-9 ()+\\-]{10,16}" autocomplete="tel"')}</div></section><section class="checkout-card"><h2><span class="step-number">2</span> Um endereço para a nova história</h2><div class="form-grid">${campo('cep','CEP','text',formatarCep(cep),'inputmode="numeric" maxlength="9" pattern="[0-9]{5}-?[0-9]{3}" autocomplete="postal-code"')}${campo('cidade','Cidade','text',perfil.cidade || '','minlength="2" maxlength="60" autocomplete="address-level2"')}${campo('endereco','Rua / avenida','text',perfil.endereco || '','minlength="3" maxlength="100" autocomplete="street-address"','span-2')}${campo('numero','Número','text',perfil.numero || '','maxlength="12"')}${campo('bairro','Bairro','text',perfil.bairro || '','minlength="2" maxlength="60"')}${campoEstado('estado',perfil.estado,true)}<div class="field"><label for="complemento">Complemento (opcional)</label><input id="complemento" name="complemento" value="${escapar(perfil.complemento)}" maxlength="60" autocomplete="address-line2"></div></div><p class="inline-note" id="checkout-shipping" aria-live="polite">Digite o CEP para atualizar o frete automaticamente. Prazo fictício: 5 a 9 dias úteis.</p></section><section class="checkout-card"><h2><span class="step-number">3</span> Como prefere pagar?</h2><div class="payment-options" role="radiogroup" aria-label="Forma de pagamento"><label class="payment-option"><input type="radio" name="pagamento" value="pix" checked> PIX</label><label class="payment-option"><input type="radio" name="pagamento" value="credito"> Crédito</label><label class="payment-option"><input type="radio" name="pagamento" value="debito"> Débito</label></div><div id="payment-details" class="payment-details">${painelPagamento('pix',totais.total)}</div></section><label class="checkout-consent"><input id="confirmar-simulacao" type="checkbox" required><span>Entendo que esta compra é uma simulação escolar e que devo usar informações fictícias.</span></label><div id="checkout-error" class="error-text" role="alert"></div><button class="button full" id="complete-order" type="submit">Simular compra ${icone('arrow')}</button><p class="inline-note">As informações de pagamento não são reais. Os pedidos de demonstração ficam somente neste navegador.</p></form><aside class="summary" aria-label="Resumo do pedido"><h2>Sua nova coleção</h2><div class="checkout-summary-list">${miniItens(itens)}</div><div id="checkout-totals">${linhasTotais(totais)}</div><p class="summary-note">${icone('lock')} Sem cobrança. Sem dados bancários.</p>${cupom ? '<p class="success-text">Cupom DOOM10 aplicado.</p>' : '<p class="inline-note">Dica: aplique DOOM10 no carrinho para ganhar 10%.</p>'}</aside></div></div>`;
  }
  function painelPagamento(metodo,total) {
    if (metodo === 'pix') return `<div class="pix-box"><span>${icone('pix')}</span><h3>PIX de demonstração</h3><p>O botão abaixo copia um texto fictício para demonstrar a opção PIX. Ele não gera uma cobrança.</p><code class="pix-code">DOOMDOLLS-PIX-FICTICIO-SEM-VALOR</code><button type="button" class="button secondary small" data-action="copy-pix">Copiar código demonstrativo</button></div>`;
    const credito = metodo === 'credito';
    return `<div class="demo-card">${icone('card')}<div><strong>Cartão de ${credito ? 'crédito' : 'débito'} fictício ···· 4242</strong><small>Cartão de exemplo · Não informe dados bancários</small></div></div>${credito ? `<div class="field"><label for="parcelas">Escolha o parcelamento (sem juros)</label><select id="parcelas" name="parcelas">${Array.from({length:6},(_,i) => { const n = i + 1; const valores = DoomCore.parcelar(total,n); return `<option value="${n}">${n}x de até ${dinheiro(valores[0])}${n === 1 ? ' à vista' : ' sem juros'} · Total ${dinheiro(total)}</option>`; }).join('')}</select></div><p class="inline-note">Quando necessário, há ajuste de R$ 0,01 entre parcelas para manter o total exato.</p>` : '<p>Pagamento à vista pelo valor total do pedido. A aprovação será apenas demonstrativa.</p>'}`;
  }
  function atualizarCheckout() {
    const input = $('#cep');
    if (!input) return;
    cep = apenasNumeros(input.value);
    gravar('cep',cep);
    const totais = totaisCompra(itensCompra());
    $('#checkout-totals').innerHTML = linhasTotais(totais);
    $('#checkout-shipping').textContent = DoomCore.calcularFrete(cep,totais.subtotal) ? `Frete demonstrativo: ${totais.frete ? dinheiro(totais.frete) : 'grátis'} · Prazo: 5 a 9 dias úteis.` : 'Informe um CEP de 8 dígitos para calcular o frete.';
    if ($('input[name="pagamento"]:checked')?.value === 'credito') {
      const anterior = $('#parcelas')?.value || '1';
      $('#payment-details').innerHTML = painelPagamento('credito',totais.total);
      $('#parcelas').value = anterior;
    }
  }
  async function concluirPedido(formulario) {
    if (finalizando) return;
    const itens = itensCompra();
    if (!itens.length) { avisar('Seu carrinho está vazio.'); location.hash = '#carrinho'; return; }
    const dados = new FormData(formulario);
    const nome = String(dados.get('nome')).trim();
    const endereco = String(dados.get('endereco')).trim();
    const cidade = String(dados.get('cidade')).trim();
    const bairro = String(dados.get('bairro')).trim();
    cep = apenasNumeros(dados.get('cep'));
    const erro = $('#checkout-error');
    if (nome.length < 3 || endereco.length < 3 || cidade.length < 2 || bairro.length < 2) { erro.textContent = 'Preencha nome e endereço com informações válidas para a simulação.'; return; }
    if (!DoomCore.calcularFrete(cep,DoomCore.subtotal(itens,PRODUTOS))) { erro.textContent = 'Informe um CEP válido com 8 dígitos.'; $('#cep').focus(); return; }
    if (apenasNumeros(dados.get('telefone')).length < 10) { erro.textContent = 'Informe um telefone fictício com DDD e pelo menos 10 dígitos.'; $('#telefone').focus(); return; }
    const metodo = dados.get('pagamento');
    if (!['pix','debito','credito'].includes(metodo)) { erro.textContent = 'Escolha uma forma de pagamento.'; return; }
    finalizando = true;
    const botao = $('#complete-order');
    botao.disabled = true;
    const totais = totaisCompra(itens);
    const id = `DD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
    const pedido = {
      id, data: new Date().toISOString(), nome, email: String(dados.get('email')).trim(),
      cidade, estado: String(dados.get('estado')), pagamento: metodo,
      parcelas: metodo === 'credito' ? Math.max(1,Math.min(6,Number(dados.get('parcelas')) || 1)) : 1,
      itens: itens.map(item => {const p = produtoPorId(item.id); return {id:p.id,nome:p.nome,imagem:p.imagem,preco:p.preco,quantidade:item.quantidade};}),
      subtotal:totais.subtotal, desconto:totais.desconto, frete:totais.frete, total:totais.total
    };
    pedidos.unshift(pedido);
    pedidos = pedidos.slice(0,30);
    gravar('pedidos',pedidos);
    if (rotaAtual().parametros.get('direta') === '1') { compraDireta = []; gravar('compraDireta',[]); }
    else { carrinho = []; salvarCarrinho(); cupom = ''; gravar('cupom',''); }
    finalizando = false;
    location.hash = `#sucesso/${id}`;
  }
  const nomePagamento = pedido => pedido.pagamento === 'pix' ? 'PIX demonstrativo' : pedido.pagamento === 'debito' ? 'Débito fictício · à vista' : `Crédito fictício · ${pedido.parcelas}x de até ${dinheiro(DoomCore.parcelar(pedido.total,pedido.parcelas)[0])}`;
  const dataPedido = pedido => new Date(pedido.data).toLocaleDateString('pt-BR');
  function sucesso(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return paginaNaoEncontrada();
    const sugeridos = ['hello-kitty-lyla','frankie-stein','hello-kitty-tiffany','blythe-castanha'].map(produtoPorId).filter(Boolean);
    return `<div class="container"><section class="confirmation"><div class="confirmation-art"><img src="assets/images/pedido-confirmado.png" alt="Ovelha da Doomdolls com botões, para a confirmação do pedido" width="262" height="217"></div><span class="eyebrow">Uma nova história começa aqui</span><h1>Compra efetuada!</h1><p>${escapar(pedido.nome.split(' ')[0])}, sua simulação foi concluída. Sua coleção ganhou uma nova história — e um carinho da Doomdolls.</p><div class="order-meta"><span>Pedido <strong>${escapar(pedido.id)}</strong></span><span>${dataPedido(pedido)}</span></div><div class="confirmation-card"><h2>Os detalhes da sua escolha</h2>${pedido.itens.map(item => `<div class="checkout-summary-item"><img src="${imagens + escapar(produtoPorId(item.id)?.imagem || item.imagem)}" alt="${escapar(item.nome)}" width="41" height="49"><div><strong>${escapar(item.nome)}</strong><small>${item.quantidade} ${item.quantidade === 1 ? 'unidade' : 'unidades'}</small></div><span>${dinheiro(item.preco * item.quantidade)}</span></div>`).join('')}<div class="divider"></div><div class="summary-line"><span>Pagamento simulado</span><span>${nomePagamento(pedido)}</span></div>${linhasTotais({...pedido,calculado:true})}<div class="success-banner">${icone('check')} Simulação aprovada. Nenhuma cobrança foi realizada.</div></div><div class="confirmation-actions"><a class="button" href="#rastreio/${pedido.id}">Acompanhar pedido ${icone('arrow')}</a><a class="button secondary" href="#catalogo">Continuar explorando</a></div>${lacinho()}<p class="inline-note">Pedido salvo somente neste navegador. O acompanhamento é demonstrativo.</p></section><section class="success-recommendations"><div class="section-top"><div><span class="eyebrow">Seu próximo encontro</span><h2>Recomendações</h2></div><a href="#catalogo">Ver coleção ${icone('arrow')}</a></div><div class="product-grid">${sugeridos.filter(p => !pedido.itens.some(i => i.id === p.id)).concat(CATALOGO.filter(p => !sugeridos.includes(p) && !pedido.itens.some(i => i.id === p.id))).slice(0,4).map(cartao).join('')}</div></section></div>`;
  }
  function cartaoPedido(pedido) {
    return `<article class="order-card"><img src="${imagens + escapar(produtoPorId(pedido.itens[0]?.id)?.imagem || pedido.itens[0]?.imagem || 'doll_3.png')}" alt="${escapar(pedido.itens[0]?.nome || 'Boneca')}" width="62" height="75"><div><h3>Pedido ${escapar(pedido.id)}</h3><p>${dataPedido(pedido)} · ${pedido.itens.reduce((s,i) => s + i.quantidade,0)} ${pedido.itens.reduce((s,i) => s + i.quantidade,0) === 1 ? 'item' : 'itens'} · simulação confirmada</p><strong>${dinheiro(pedido.total)}</strong></div><a href="#rastreio/${pedido.id}" class="button secondary small">Acompanhar ${icone('arrow')}</a></article>`;
  }
  function telaPerfil(parametros) {
    if (!sessaoAtiva) return telaAcesso(false);
    const aba = parametros.get('aba') === 'pedidos' ? 'pedidos' : 'dados';
    fotoPerfilPendente = perfil.foto;
    const formulario = `
      <div class="notice">${icone('lock')}<span>Sua foto e seus dados ficam salvos neste navegador e preenchem suas próximas compras. Use informações fictícias nesta demonstração.</span></div>
      <div class="panel">
        <h2>Meu perfil</h2>
        <p class="muted">Seus dados, seu endereço e um cantinho com a sua cara.</p>
        <form id="profile-form" class="profile-form">
          <div class="profile-photo-editor">
            ${avatarPerfil()}
            <div>
              <strong>Sua foto de perfil</strong>
              <div class="photo-editor-actions">
                <button type="button" class="button secondary small" data-action="choose-avatar">Alterar foto</button>
                <button type="button" class="text-button" id="remove-avatar" data-action="remove-avatar" ${perfil.foto ? '' : 'hidden'}>Remover foto</button>
              </div>
              <input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" hidden>
              <p class="inline-note">JPG, PNG ou WebP · até 10 MB.</p>
            </div>
          </div>
          <p class="inline-note" id="profile-photo-message" aria-live="polite"></p>
          <h3 class="profile-form-heading">Dados de contato</h3>
          <div class="form-grid">
            ${campo('perfil-nome','Nome completo','text',perfil.nome,'minlength="3" maxlength="80" autocomplete="name"','span-2')}
            ${campo('perfil-email','E-mail','email',perfil.email,'maxlength="120" autocomplete="email"')}
            ${campo('perfil-telefone','Telefone','tel',perfil.telefone,'maxlength="16" pattern="[0-9 ()+\\-]{10,16}" autocomplete="tel"')}
          </div>
          <h3 class="profile-form-heading">Endereço de entrega</h3>
          <p class="inline-note">Preencha seu endereço para não precisar digitá-lo a cada compra.</p>
          <div class="form-grid">
            ${campo('perfil-cep','CEP','text',formatarCep(perfil.cep),'inputmode="numeric" maxlength="9" pattern="[0-9]{5}-?[0-9]{3}" autocomplete="postal-code"','',false)}
            ${campo('perfil-cidade','Cidade','text',perfil.cidade,'maxlength="60" autocomplete="address-level2"','',false)}
            ${campo('perfil-endereco','Rua / avenida','text',perfil.endereco,'maxlength="100" autocomplete="street-address"','span-2',false)}
            ${campo('perfil-numero','Número','text',perfil.numero,'maxlength="12"','',false)}
            ${campo('perfil-bairro','Bairro','text',perfil.bairro,'maxlength="60"','',false)}
            ${campoEstado('perfil-estado',perfil.estado)}
            ${campo('perfil-complemento','Complemento (opcional)','text',perfil.complemento,'maxlength="60" autocomplete="address-line2"','',false)}
          </div>
          <button class="button" type="submit" id="save-profile">Salvar alterações ${icone('check')}</button>
          <p class="inline-note" id="profile-message" aria-live="polite"></p>
        </form>
      </div>`;
    const ultimosPedidos = `<div class="section-top"><h2>Meu último pedido</h2><a href="#perfil?aba=pedidos">Ver todos ${icone('arrow')}</a></div>${pedidos.length ? cartaoPedido(pedidos[0]) : '<p class="muted">Sua próxima história pode começar na coleção.</p>'}`;
    return `<div class="container">
      ${cabecalhoPagina('Seu cantinho','Um lugar para cuidar dos seus dados e das suas histórias.')}
      <div class="profile-layout">
        <aside class="profile-sidebar">
          ${avatarPerfil()}
          <h2>${escapar(perfil.nome || 'Olá, colecionadora!')}</h2>
          <p>${escapar(perfil.email || 'Bem-vinda ao seu lado secreto.')}</p>
          <nav class="profile-tabs" aria-label="Áreas do perfil">
            <a href="#perfil" class="${aba === 'dados' ? 'active' : ''}">${icone('user')} Meus dados</a>
            <a href="#perfil?aba=pedidos" class="${aba === 'pedidos' ? 'active' : ''}">${icone('box')} Meus pedidos</a>
            <a href="#favoritos">${icone('heart')} Favoritos</a>
            <a href="#carrinho">${icone('bag')} Meu carrinho</a>
            <button class="text-button" data-action="logout">Sair da demonstração</button>
          </nav>
        </aside>
        <section class="profile-main">
          ${aba === 'pedidos' ? `<h2>Minhas novas histórias</h2><p class="muted">Compras de demonstração realizadas neste navegador.</p>${pedidos.length ? pedidos.map(cartaoPedido).join('') : vazio('Sua primeira história ainda está por vir.','Quando você concluir uma compra simulada, ela aparecerá aqui.','box')}` : formulario + ultimosPedidos}
        </section>
      </div>
    </div>`;
  }
  function telaFavoritos() {
    const lista = CATALOGO.filter(p => favoritos.includes(p.id));
    return `<div class="container">${cabecalhoPagina('Guardadas com o coração.','Suas favoritas, sempre por perto.',[{nome:'Favoritos'}])}<section class="favorites-section">${lista.length ? `<div class="product-grid">${lista.map(cartao).join('')}</div>` : vazio('Quem vai conquistar seu coração?','Toque no coração de uma boneca para guardar suas favoritas por aqui.','heart')}</section></div>`;
  }
  function telaAcesso(cadastro) {
    return `<div class="container access-container"><section class="access-layout"><div class="access-art"><img src="assets/images/referencias/poster-acesso-original.svg" width="224" height="342" alt="Arte original da tela de acesso: logo Doomdolls, ovelhas e botões em tons de cinza"><div class="access-art-caption"><span class="tiny-caps">Doomdolls</span><p>Seu mundo de estilo<br>e diversidade.</p></div></div><div class="access-copy"><img class="access-bow" src="assets/icons/bow.svg" width="80" height="60" alt=""><span class="eyebrow">Seu pequeno universo</span><h1>${cadastro ? 'Entre no seu universo.' : 'Revisite sua coleção!'}</h1><p>${cadastro ? 'Crie um perfil demonstrativo para guardar suas histórias.' : 'Acesse seu cantinho para continuar.'}</p><div class="notice"><span>${icone('lock')}</span><span>Acesso fictício para a atividade escolar. Use um e-mail e uma senha inventados. A senha não é salva nem enviada.</span></div><form id="access-form" data-cadastro="${cadastro}">${cadastro ? campo('acesso-nome','Nome','text',perfil.nome || '','minlength="3" maxlength="80" autocomplete="off"') : ''}${campo('acesso-email','E-mail','email',perfil.email || '','maxlength="120" placeholder="colecionadora@example.com" autocomplete="off"')}${campo('acesso-senha','Senha fictícia','password','','minlength="4" maxlength="60" placeholder="Invente uma senha de exemplo" autocomplete="off"')}<button class="text-button demo-access" type="button" data-action="demo-access">Preencher exemplo fictício</button><p id="access-error" class="error-text" role="alert"></p><button type="submit" class="button full">${cadastro ? 'Criar conta demonstrativa' : 'Entrar na demonstração'} ${icone('arrow')}</button></form><p class="access-switch">${cadastro ? 'Já possui uma conta?' : 'Ainda não tem uma conta?'} <a href="${cadastro ? '#login' : '#cadastro'}">${cadastro ? 'Entre' : 'Criar conta'}</a></p><a class="text-button" href="#catalogo">Explorar sem entrar ${icone('arrow')}</a><div class="access-footnote">Doomdolls · Dark cute collections</div></div></section></div>`;
  }
  function rastreio(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return `<div class="container">${cabecalhoPagina('Acompanhar pedido','')}${vazio('Pedido não encontrado.','Seus pedidos simulados ficam salvos no navegador em que foram feitos.','box','#perfil?aba=pedidos','Ver meus pedidos')}</div>`;
    return `<div class="container">${cabecalhoPagina('A caminho de novas histórias.','Acompanhe as etapas ilustrativas do seu pedido.',[{nome:'Meus pedidos',url:'#perfil?aba=pedidos'},{nome:pedido.id}])}<section class="tracking"><div class="notice">${icone('truck')} Acompanhamento demonstrativo: não há envio real nem integração com transportadoras.</div><div class="panel" style="margin-top:22px"><span class="eyebrow">Pedido ${escapar(pedido.id)}</span><h2>Uma escolha cheia de afeto.</h2><p class="muted">${dataPedido(pedido)} · ${escapar(pedido.cidade)}, ${escapar(pedido.estado)}</p><div class="timeline"><div class="timeline-step done"><span class="timeline-dot">${icone('check')}</span><div><h3>Pedido confirmado</h3><p>Compra de demonstração concluída em ${dataPedido(pedido)}.</p></div></div><div class="timeline-step"><span class="timeline-dot">${icone('box')}</span><div><h3>Preparando sua história</h3><p>Próxima etapa ilustrativa: separação e embalagem.</p></div></div><div class="timeline-step"><span class="timeline-dot">${icone('truck')}</span><div><h3>Em transporte</h3><p>Etapa ilustrativa. O prazo fictício é de 5 a 9 dias úteis.</p></div></div><div class="timeline-step"><span class="timeline-dot">${icone('heart')}</span><div><h3>Um novo lugar na coleção</h3><p>Etapa final da experiência demonstrativa.</p></div></div></div><div class="divider"></div><div class="summary-line"><span>Total da simulação</span><strong>${dinheiro(pedido.total)}</strong></div><div class="summary-line"><span>Pagamento</span><span>${nomePagamento(pedido)}</span></div><a class="button secondary" href="#sucesso/${pedido.id}">Ver detalhes do pedido ${icone('arrow')}</a></div></section></div>`;
  }
  function sobre() {
    return `<div class="container">${cabecalhoPagina('Bonecas com histórias.','Para quem coleciona um lado secreto.',[{nome:'Sobre a Doomdolls'}])}<section class="about-layout"><img src="assets/images/login_art.png" alt="Arte original da Doomdolls com ovelha, estrelas, lua e bonecas" width="341" height="545"><div><span class="eyebrow">O extraordinário mora nos detalhes</span><h2>Um refúgio para o que faz seus olhos brilharem.</h2><p>A Doomdolls é uma loja de bonecas colecionáveis com uma identidade delicada e um toque gótico. Ovelhas, laços e pequenos detalhes fazem parte do nosso universo.</p><p>Aqui, cada personagem tem espaço para uma nova história. Nossa proposta é transformar a busca por uma boneca em uma experiência acolhedora e cheia de personalidade.</p>${lacinho()}<p>Este site foi desenvolvido como projeto escolar de Criação de Sites por Júlia Zanini Stein, turma 62.2. Produtos, avaliações, estoque, entrega e pagamentos fazem parte de uma demonstração.</p><a class="button" href="#catalogo">Conhecer a coleção ${icone('arrow')}</a></div></section></div>`;
  }
  function paginaNaoEncontrada() { return `<div class="container not-found">${vazio('Esta história se perdeu…','A página que você procura não foi encontrada. Vamos voltar para a coleção?','search')}</div>`; }

  function renderizar(rolar = true) {
    const rota = rotaAtual();
    const paginas = {inicio, catalogo:() => catalogo(rota.parametros),produto:() => detalhes(rota.id),carrinho:telaCarrinho,checkout,sucesso:() => sucesso(rota.id),perfil:() => telaPerfil(rota.parametros),favoritos:telaFavoritos,rastreio:() => rastreio(rota.id),sobre,login:() => telaAcesso(false),cadastro:() => telaAcesso(true)};
    conteudo.innerHTML = (paginas[rota.pagina] || paginaNaoEncontrada)();
    const titulos = {login:'Entrar',cadastro:'Criar conta',inicio:'Bonecas com histórias',catalogo:'Nossa coleção',produto:produtoPorId(rota.id)?.nome || 'Produto',carrinho:'Seu carrinho',checkout:'Finalizar pedido',sucesso:'Compra simulada confirmada',perfil:'Seu cantinho',favoritos:'Favoritos',rastreio:'Acompanhar pedido',sobre:'Sobre a Doomdolls'};
    document.title = `${rota.pagina === 'perfil' && !sessaoAtiva ? 'Entrar' : titulos[rota.pagina] || 'Página não encontrada'} | Doomdolls`;
    document.querySelectorAll('[data-nav],[data-mobile]').forEach(link => {
      const pagina = link.dataset.nav || link.dataset.mobile;
    const atual = pagina === rota.pagina || (pagina === 'catalogo' && rota.pagina === 'produto');
      if (atual) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    $('#main-nav').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded','false');
    $('#search-panel').hidden = true;
    $('#search-toggle').setAttribute('aria-expanded','false');
    preencherIcones(); atualizarContador();
    if (rolar) {window.scrollTo(0,0); conteudo.focus({preventScroll:true});}
  }
  function adicionar(id, quantidade = 1) {
    const produto = produtoPorId(id);
    if (!produto) return;
    const existente = carrinho.find(item => item.id === id);
    if (existente && existente.quantidade + quantidade > produto.estoque) {avisar(`Limite de ${produto.estoque} unidades para esta boneca.`); return;}
    if (existente) existente.quantidade += quantidade;
    else carrinho.push({id,quantidade:Math.min(produto.estoque,quantidade)});
    salvarCarrinho();
    avisar(`${produto.nome} adicionada ao carrinho.`,true);
  }

  // Um único listener atende aos botões que são criados dinamicamente nas páginas.
  document.addEventListener('click', async evento => {
    const botao = evento.target.closest('[data-action]');
    if (!botao) return;
    const {action,id} = botao.dataset;
    const produto = produtoPorId(id);
    if (action === 'favorite' && produto) {
      const incluido = favoritos.includes(id);
      favoritos = incluido ? favoritos.filter(f => f !== id) : [...favoritos,id];
      gravar('favoritos',favoritos);
      if (rotaAtual().pagina === 'favoritos') renderizar(false);
      else document.querySelectorAll(`[data-action="favorite"][data-id="${id}"]`).forEach(b => {b.setAttribute('aria-pressed',String(!incluido));b.setAttribute('aria-label',`${incluido ? 'Adicionar aos' : 'Remover dos'} favoritos: ${produto.nome}`);});
      avisar(incluido ? 'Boneca removida dos favoritos.' : 'Guardada com o coração.');
    }
    if (action === 'add') adicionar(id);
    if (action === 'add-product') adicionar(id,quantidadeProduto);
    if (action === 'product-minus') quantidadeProduto = Math.max(1,quantidadeProduto - 1);
    if (action === 'product-plus' && produto) quantidadeProduto = Math.min(produto.estoque,quantidadeProduto + 1);
    if (action.startsWith('product-') && $('#product-quantity')) $('#product-quantity').textContent = quantidadeProduto;
    if (action === 'buy' && produto) {compraDireta = [{id,quantidade:quantidadeProduto}];gravar('compraDireta',compraDireta);location.hash = '#checkout?direta=1';}
    if ((action === 'cart-minus' || action === 'cart-plus') && produto) {
      const item = carrinho.find(i => i.id === id);
      if (item) item.quantidade = Math.max(1,Math.min(produto.estoque,item.quantidade + (action === 'cart-plus' ? 1 : -1)));
      salvarCarrinho(); renderizar(false);
    }
    if (action === 'remove') {carrinho = carrinho.filter(i => i.id !== id);salvarCarrinho();renderizar(false);avisar('Boneca removida do carrinho.');}
    if (action === 'remove-coupon') {cupom = '';gravar('cupom','');renderizar(false);}
    if (action === 'filters') {const aberto = $('#catalog-filters').classList.toggle('open');botao.setAttribute('aria-expanded',String(aberto));}
    if (action === 'photo') {
      $('#gallery-main').classList.remove('zoom');
      const lupa = $('[data-action="zoom"]'); lupa.setAttribute('aria-pressed','false'); lupa.setAttribute('aria-label','Ampliar foto');
      const foto = $('#main-photo'); foto.src = imagens + botao.dataset.src; foto.alt = `Boneca ${produto.nome}, foto da galeria`;
      document.querySelectorAll('.gallery-thumbs button').forEach(b => {b.classList.toggle('active',b === botao);b.setAttribute('aria-pressed',String(b === botao));});
    }
    if (action === 'zoom') {const ativo = $('#gallery-main').classList.toggle('zoom');botao.setAttribute('aria-pressed',String(ativo));botao.setAttribute('aria-label',ativo ? 'Reduzir foto' : 'Ampliar foto');}
    if (action === 'fill-demo') {
      const exemplo = {nome:'Marina Exemplo',email:'marina@example.com',telefone:'(51) 99999-0000',cep:'95600-000',cidade:'Taquara',endereco:'Rua das Bonecas',numero:'123',bairro:'Centro',estado:'RS',complemento:'Endereço fictício'};
      Object.entries(exemplo).forEach(([chave,valor]) => {if ($('#'+chave)) $('#'+chave).value = valor;}); atualizarCheckout();avisar('Dados fictícios preenchidos.');
    }
    if (action === 'copy-pix') {
      try {await navigator.clipboard.writeText('DOOMDOLLS-PIX-FICTICIO-SEM-VALOR');avisar('Código fictício copiado. Ele não realiza pagamentos.');}
      catch {avisar('Selecione e copie o código demonstrativo exibido na tela.');}
    }
    if (action === 'demo-access') {
      $('#acesso-email').value = 'marina@example.com';$('#acesso-senha').value = 'exemplo123';
      if ($('#acesso-nome')) $('#acesso-nome').value = 'Marina Exemplo';
      avisar('Exemplo fictício preenchido.');
    }
    if (action === 'choose-avatar') $('#profile-photo').click();
    if (action === 'remove-avatar') {
      versaoFoto++; processandoFoto = false; fotoPerfilPendente = '';
      $('#profile-photo').value = ''; $('#save-profile').disabled = false;
      atualizarPreviaAvatar('');
      $('#profile-photo-message').textContent = 'Foto removida da prévia. Salve as alterações para confirmar.';
    }
    if (action === 'logout') {sessaoAtiva = false;gravar('sessao',false);location.hash = '#login';}
    if (action === 'info') {
      $('#dialog-content').innerHTML = '<span class="eyebrow">Cuidado que vira memória</span><h2>Seu pequeno ritual de cuidado.</h2><p>Guarde suas bonecas longe do sol direto, calor e umidade. Remova a poeira com pano macio e seco, sem produtos abrasivos.</p><p>Evite puxar os cabelos ou forçar as articulações. Para peças especiais, siga as orientações do fabricante.</p>'+lacinho();$('#info-dialog').showModal();
    }
    if (action === 'close-dialog') $('#info-dialog').close();
  });
  document.addEventListener('submit', evento => {
    const formulario = evento.target;
    if (!['header-search','catalog-search','coupon-form','checkout-form','profile-form','access-form'].includes(formulario.id) && formulario.dataset.form !== 'shipping') return;
    evento.preventDefault();
    if (formulario.id === 'header-search' || formulario.id === 'catalog-search') {
      const busca = new FormData(formulario).get('busca').trim();
      location.hash = formulario.id === 'catalog-search' ? urlCatalogo({busca}) : `#catalogo${busca ? '?busca='+encodeURIComponent(busca) : ''}`;
      $('#search-panel').hidden = true;
    }
    if (formulario.dataset.form === 'shipping') {
      const valor = new FormData(formulario).get('cep');
      const contexto = formulario.dataset.context;
      const base = contexto === 'product' ? produtoPorId(rotaAtual().id).preco * quantidadeProduto : DoomCore.subtotal(carrinho,PRODUTOS);
      const frete = DoomCore.calcularFrete(valor,base);
      if (!frete) {$('#shipping-result').textContent = 'Informe um CEP válido com 8 dígitos.';return;}
      cep = apenasNumeros(valor);gravar('cep',cep);
      if (contexto === 'cart') renderizar(false);
      else $('#shipping-result').textContent = `Entrega demonstrativa: ${frete.valor ? dinheiro(frete.valor) : 'grátis'} · ${frete.prazo}.`;
    }
    if (formulario.id === 'coupon-form') {
      const codigo = String(new FormData(formulario).get('cupom')).trim().toUpperCase();
      if (codigo !== 'DOOM10') {$('#coupon-result').className = 'error-text';$('#coupon-result').textContent = 'Cupom não encontrado. Experimente DOOM10.';return;}
      cupom = codigo;gravar('cupom',cupom);renderizar(false);avisar('Cupom DOOM10 aplicado aos produtos.');
    }
    if (formulario.id === 'checkout-form') concluirPedido(formulario);
    if (formulario.id === 'profile-form') salvarPerfil(formulario);
    if (formulario.id === 'access-form') {
      const dados = new FormData(formulario);
      const email = String(dados.get('acesso-email')).trim();
      const nome = String(dados.get('acesso-nome') || perfil.nome || 'Colecionadora').trim();
      if (nome.length < 3) {$('#access-error').textContent = 'Informe um nome fictício com pelo menos 3 caracteres.';return;}
      perfil = DoomPerfil.atualizar(perfil,{nome,email});gravar('perfil',perfil);
      // Não guardamos a senha: este formulário demonstra apenas a navegação de entrada.
      sessaoAtiva = true;gravar('sessao',true);
      if (location.hash === '#perfil') renderizar();
      else location.hash = '#perfil';
      avisar('Bem-vinda ao seu cantinho demonstrativo.');
    }
  });
  document.addEventListener('change', evento => {
    if (evento.target.id === 'profile-photo') selecionarFotoPerfil(evento.target.files[0]);
    if (evento.target.id === 'sort') location.hash = urlCatalogo({ordem:evento.target.value});
    if (evento.target.id === 'price-filter') location.hash = urlCatalogo({preco:evento.target.value});
    if (evento.target.name === 'pagamento') $('#payment-details').innerHTML = painelPagamento(evento.target.value,totaisCompra(itensCompra()).total);
    if (evento.target.id === 'cep') atualizarCheckout();
  });
  document.addEventListener('input', evento => {
    const campo = evento.target;
    if (campo.name === 'cep' || campo.name === 'perfil-cep') {campo.value = formatarCep(campo.value);if (campo.id === 'cep') atualizarCheckout();}
    if (campo.type === 'tel') campo.value = apenasNumeros(campo.value).slice(0,11).replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{4,5})(\d{4})$/,'$1-$2');
  });
  $('#menu-toggle').addEventListener('click', () => {const aberto = $('#main-nav').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(aberto));});
  $('#search-toggle').addEventListener('click', () => {const aberto = $('#search-panel').hidden;$('#search-panel').hidden = !aberto;$('#search-toggle').setAttribute('aria-expanded',String(aberto));if (aberto) $('#global-search').focus();});
  $('#info-dialog').addEventListener('click', evento => {if (evento.target === $('#info-dialog')) $('#info-dialog').close();});
  window.addEventListener('hashchange', () => renderizar());
  // Links internos da página não precisam trocar a rota da aplicação.
  document.addEventListener('click', evento => {
    if (evento.target.closest('#main-nav a')) {$('#main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}
    const pular = evento.target.closest('a.skip-link');
    if (pular) {evento.preventDefault();conteudo.focus();conteudo.scrollIntoView({block:'start'});}
    const link = evento.target.closest('a[href="#avaliacoes"]');
    if (link) {evento.preventDefault();const avaliacao = $('#avaliacoes');avaliacao.open = true;avaliacao.scrollIntoView({behavior:'smooth',block:'center'});}
  });
  window.addEventListener('storage', evento => {
    if (evento.key === 'doomdolls:carrinho') {carrinho = DoomCore.normalizarCarrinho(ler('carrinho',[]),PRODUTOS);atualizarContador();if (['carrinho','checkout'].includes(rotaAtual().pagina)) renderizar(false);}
  });
  preencherIcones();renderizar(false);
  if (!armazenamentoDisponivel) avisar('O navegador não permite salvar os dados. A loja funciona enquanto esta página estiver aberta.');
})();
