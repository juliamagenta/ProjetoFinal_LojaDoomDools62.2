const { test } = require('node:test');
const assert = require('node:assert/strict');
const loja = require('../js/loja.js');
const produtos = [
  { id: 'a', preco: 32990, estoque: 5 },
  { id: 'b', preco: 21990, estoque: 8 }
];
test('carrinho normaliza dados inválidos, reúne duplicatas e limita o estoque', () => {
  const entrada = [null,{id:'inexistente',quantidade:4},{id:'a',quantidade:2},{id:'a',quantidade:9},{id:'b',quantidade:-1},{id:'b',quantidade:2.8}];
  assert.deepEqual(loja.normalizarCarrinho(entrada,produtos),[{id:'a',quantidade:5},{id:'b',quantidade:2}]);
  assert.deepEqual(loja.normalizarCarrinho({},produtos),[]);
});
test('subtotal usa o preço do catálogo multiplicado pela quantidade', () => {
  assert.equal(loja.subtotal([{id:'a',quantidade:2},{id:'b',quantidade:1}],produtos),87970);
});
test('desconto de 10% incide nos produtos e soma o frete uma vez', () => {
  assert.deepEqual(loja.calcularTotais([{id:'a',quantidade:1}],produtos,'doom10',1490),{subtotal:32990,desconto:3299,frete:1490,total:31181});
});
test('o frete grátis considera o subtotal antes do desconto', () => {
  const itens = [{id:'a',quantidade:2}];
  assert.equal(loja.calcularTotais(itens,produtos,'DOOM10',2490).frete,0);
  assert.equal(loja.calcularFrete('95600-000',60000).valor,0);
  assert.equal(loja.calcularFrete('95600-000',59999).valor,1490);
});
test('CEP inválido não gera frete e o carrinho vazio não cobra entrega', () => {
  assert.equal(loja.calcularFrete('123',10000),null);
  assert.equal(loja.calcularFrete('00000-000',10000),null);
  assert.equal(loja.calcularTotais([],produtos,'DOOM10',2490).total,0);
});
test('cupons desconhecidos não alteram o valor dos produtos', () => {
  assert.equal(loja.calcularTotais([{id:'a',quantidade:1}],produtos,'OUTRO',0).desconto,0);
});
test('parcelas conservam cada centavo para totais não divisíveis', () => {
  for (const total of [21990,32990,31181,59382]) {
    for (let vezes=1;vezes<=6;vezes++) {
      const parcelas = loja.parcelar(total,vezes);
      assert.equal(parcelas.length,vezes);
      assert.equal(parcelas.reduce((s,v)=>s+v,0),total);
      assert.ok(Math.max(...parcelas)-Math.min(...parcelas)<=1);
    }
  }
});
