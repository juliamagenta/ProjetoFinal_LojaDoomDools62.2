// Regras de cálculo separadas da tela: também podem ser verificadas com Node.js.
(function (raiz) {
  'use strict';
  const FRETE_GRATIS = 60000;
  function normalizarCarrinho(carrinho, produtos) {
    if (!Array.isArray(carrinho)) return [];
    const reunidos = new Map();
    carrinho.forEach(item => {
      if (!item || typeof item.id !== 'string') return;
      const produto = produtos.find(p => p.id === item.id);
      const quantidade = Math.floor(Number(item.quantidade));
      if (!produto || !Number.isFinite(quantidade) || quantidade < 1) return;
      reunidos.set(item.id, Math.min(produto.estoque, (reunidos.get(item.id) || 0) + quantidade));
    });
    return [...reunidos].map(([id, quantidade]) => ({ id, quantidade }));
  }
  function subtotal(carrinho, produtos) {
    return normalizarCarrinho(carrinho, produtos).reduce((total, item) => total + produtos.find(p => p.id === item.id).preco * item.quantidade, 0);
  }
  function calcularFrete(cep, valorProdutos) {
    const numero = String(cep || '').replace(/\D/g, '');
    if (numero.length !== 8 || /^0{8}$/.test(numero)) return null;
    if (valorProdutos >= FRETE_GRATIS) return { valor: 0, prazo: '5 a 9 dias úteis', cep: numero };
    const regiao = Number(numero[0]);
    return { valor: regiao === 9 ? 1490 : regiao <= 3 ? 2490 : regiao <= 7 ? 1990 : 2290, prazo: '5 a 9 dias úteis', cep: numero };
  }
  function calcularTotais(carrinho, produtos, cupom, frete) {
    const soma = subtotal(carrinho, produtos);
    const desconto = String(cupom || '').trim().toUpperCase() === 'DOOM10' ? Math.round(soma * 0.1) : 0;
    const entrega = soma === 0 || soma >= FRETE_GRATIS ? 0 : Math.max(0, Math.round(Number(frete) || 0));
    return { subtotal: soma, desconto, frete: entrega, total: soma - desconto + entrega };
  }
  function parcelar(total, vezes) {
    const quantidade = Math.max(1, Math.min(6, Math.floor(Number(vezes) || 1)));
    const base = Math.floor(total / quantidade);
    const resto = total % quantidade;
    return Array.from({ length: quantidade }, (_, indice) => base + (indice < resto ? 1 : 0));
  }
  const api = { FRETE_GRATIS, normalizarCarrinho, subtotal, calcularFrete, calcularTotais, parcelar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.DoomCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
