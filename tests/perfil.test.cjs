const { test } = require('node:test');
const assert = require('node:assert/strict');
const perfil = require('../js/perfil.js');

test('perfis antigos mantêm contato e passam a aceitar endereço e foto', () => {
  const antigo = { nome: 'Marina Exemplo', email: 'marina@example.com', telefone: '(51) 99999-0000' };
  const atual = perfil.normalizar(antigo);
  assert.equal(atual.nome, antigo.nome);
  assert.equal(atual.email, antigo.email);
  assert.equal(atual.endereco, '');
  assert.equal(atual.foto, '');
});

test('alterar um endereço preserva os demais dados e a foto já salva', () => {
  const foto = 'data:image/webp;base64,UklGRg==';
  const anterior = { nome: 'Marina Exemplo', email: 'marina@example.com', telefone: '(51) 99999-0000', cep: '95600-000', cidade: 'Taquara', endereco: 'Rua das Bonecas', numero: '123', bairro: 'Centro', estado: 'RS', complemento: 'Casa', foto };
  const novo = perfil.atualizar(anterior, { endereco: 'Rua das Coleções', numero: '456' });
  assert.equal(novo.endereco, 'Rua das Coleções');
  assert.equal(novo.numero, '456');
  assert.equal(novo.email, anterior.email);
  assert.equal(novo.cep, '95600000');
  assert.equal(novo.complemento, 'Casa');
  assert.equal(novo.foto, foto);
});

test('limpar campos do perfil remove os valores anteriores', () => {
  const novo = perfil.atualizar({ cep: '95600-000', complemento: 'Casa', foto: 'data:image/png;base64,AAAA' }, { cep: '', complemento: '', foto: '' });
  assert.equal(novo.cep, '');
  assert.equal(novo.complemento, '');
  assert.equal(novo.foto, '');
});

test('o perfil aceita endereço ainda vazio, mas rejeita CEP incompleto', () => {
  const contato = { nome: 'Marina Exemplo', email: 'marina@example.com', telefone: '(51) 99999-0000' };
  assert.equal(perfil.validar(contato), null);
  assert.equal(perfil.validar({ ...contato, cep: '123' }).campo, 'cep');
});

test('a foto aceita apenas imagens locais e descarta senha e campos desconhecidos', () => {
  const dado = perfil.normalizar({ nome: 'Marina Exemplo', senha: 'nao-salvar', foto: 'data:image/svg+xml;base64,AAAA', acesso: 'administrador' });
  assert.equal(dado.foto, '');
  assert.equal('senha' in dado, false);
  assert.equal('acesso' in dado, false);
  assert.equal(perfil.fotoValida('https://example.com/foto.jpg'), false);
});
