// Dados do perfil usados tanto na edição quanto no preenchimento da compra.
(function (raiz) {
  'use strict';
  const campos = ['nome', 'email', 'telefone', 'cep', 'cidade', 'endereco', 'numero', 'bairro', 'estado', 'complemento'];
  const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  function fotoValida(foto) {
    return typeof foto === 'string' && foto.length < 1000000 && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(foto);
  }
  function normalizar(dados) {
    const origem = dados && typeof dados === 'object' && !Array.isArray(dados) ? dados : {};
    const perfil = Object.fromEntries(campos.map(campo => [campo, typeof origem[campo] === 'string' ? origem[campo].trim() : '']));
    perfil.cep = perfil.cep.replace(/\D/g, '');
    perfil.estado = estados.includes(perfil.estado) ? perfil.estado : '';
    perfil.foto = fotoValida(origem.foto) ? origem.foto : '';
    return perfil;
  }
  function atualizar(anterior, alteracoes) {
    return normalizar({ ...normalizar(anterior), ...alteracoes });
  }
  function validar(dados) {
    const perfil = normalizar(dados);
    if (perfil.nome.length < 3) return { campo: 'nome', mensagem: 'Informe um nome com pelo menos 3 caracteres.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.email)) return { campo: 'email', mensagem: 'Informe um e-mail válido.' };
    const telefone = perfil.telefone.replace(/\D/g, '');
    if (telefone.length < 10 || telefone.length > 11) return { campo: 'telefone', mensagem: 'Informe um telefone com DDD e 10 ou 11 dígitos.' };
    if (perfil.cep && (perfil.cep.length !== 8 || perfil.cep === '00000000')) return { campo: 'cep', mensagem: 'Informe um CEP válido com 8 dígitos ou deixe o campo vazio.' };
    return null;
  }
  const api = { campos, estados, fotoValida, normalizar, atualizar, validar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.DoomPerfil = api;
})(typeof window !== 'undefined' ? window : globalThis);
