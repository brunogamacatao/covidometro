// Constantes
var DELAY_ATUALIZACAO_LOCAL    = 1000;
var DELAY_ATUALIZACAO_SERVIDOR = 300000;

// Elementos da página
var span_casos = document.getElementById('casos');
var span_obitos = document.getElementById('obitos');
var span_ultima_atualizacao = document.getElementById('ultima_atualizacao');

// Dados
var data_ultima_atualizacao_pelo_servidor = null;
var dados = {};
var atualizando_pelo_servidor = true;

function atualizaInformacoesDaPagina(d) {
  span_casos.innerHTML = parseInt(d.casos);
  span_obitos.innerHTML = parseInt(d.obitos);
  span_ultima_atualizacao.innerHTML = d.ultima_atualizacao;
}

function atualizaLocalmente() {
  if (atualizando_pelo_servidor) {
    return;
  }

  var data_atual = new Date();
  var delta_t = (data_atual.getTime() - data_ultima_atualizacao_pelo_servidor.getTime()) / 1000;
  var novos_dados = {
    casos:  parseFloat(dados.casos)  + (parseFloat(dados.casos_por_segundo)  * delta_t),
    obitos: parseFloat(dados.obitos) + (parseFloat(dados.obitos_por_segundo) * delta_t),
    ultima_atualizacao: dados.ultima_atualizacao
  };

  atualizaInformacoesDaPagina(novos_dados);
  setTimeout(atualizaLocalmente, DELAY_ATUALIZACAO_LOCAL);
}

function atualizaPeloServidor() {
  atualizando_pelo_servidor = true;

  fetch('/dados', {method: 'get'}).then(function(response) {
    response.json().then(function(data) {
      data_ultima_atualizacao_pelo_servidor = new Date();
      dados = data;

      atualizaInformacoesDaPagina(dados);
      atualizando_pelo_servidor = false;

      setTimeout(atualizaLocalmente, DELAY_ATUALIZACAO_LOCAL);
      setTimeout(atualizaPeloServidor, DELAY_ATUALIZACAO_SERVIDOR);
    });
  });  
}

// Quando a página for carregada, chama...
atualizaPeloServidor();