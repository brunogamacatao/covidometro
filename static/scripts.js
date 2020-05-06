// Constantes
var DELAY_ATUALIZACAO_LOCAL    = 1000;
var DELAY_ATUALIZACAO_SERVIDOR = 300000;

// Elementos da página
var span_casos              = document.getElementById('casos');
var span_obitos             = document.getElementById('obitos');
var span_ultima_atualizacao = document.getElementById('ultima_atualizacao');
var span_prox_caso          = document.getElementById('prox_caso');
var span_prox_obito         = document.getElementById('prox_obito');

// Dados
var data_ultima_atualizacao_pelo_servidor = null;
var dados = {};
var atualizando_pelo_servidor = true;

function atualizaInformacoesDaPagina(d) {
  span_casos.innerHTML = parseInt(d.casos);
  span_obitos.innerHTML = parseInt(d.obitos);
  span_ultima_atualizacao.innerHTML = d.ultima_atualizacao;

  var data_atual = new Date();
  var secs_para_proximo_caso  = (dados.proximo_caso.getTime() - data_atual.getTime()) / 1000;
  var secs_para_proximo_obito = (dados.proximo_obito.getTime() - data_atual.getTime()) / 1000;

  if (secs_para_proximo_caso <= 0) {
    var casos_por_msecs  = parseInt(1 / parseFloat(dados.casos_por_segundo) * 1000);
    dados.proximo_caso  = new Date(data_atual.getTime() + casos_por_msecs);
  }

  if (secs_para_proximo_obito <= 0) {
    var obitos_por_msecs = parseInt(1 / parseFloat(dados.obitos_por_segundo) * 1000);
    dados.proximo_obito = new Date(data_atual.getTime() + obitos_por_msecs);
  }

  var str_prox_caso  = Math.abs(secs_para_proximo_caso).toFixed(0) + 's';
  var str_prox_obito = Math.abs(secs_para_proximo_obito / 60).toFixed(0) + 'm' + Math.abs(secs_para_proximo_obito % 60).toFixed(0) + 's';

  span_prox_caso.innerHTML  = 'próximo caso em '  + str_prox_caso;
  span_prox_obito.innerHTML = 'próximo óbito em ' + str_prox_obito;
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
    ultima_atualizacao: dados.ultima_atualizacao,
    proximo_caso: dados.proximo_caso,
    proximo_obito: dados.proximo_obito
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

      var casos_por_msecs  = parseInt(1 / parseFloat(dados.casos_por_segundo) * 1000);
      var obitos_por_msecs = parseInt(1 / parseFloat(dados.obitos_por_segundo) * 1000);

      dados.proximo_caso  = new Date(new Date().getTime() + casos_por_msecs);
      dados.proximo_obito = new Date(new Date().getTime() + obitos_por_msecs);

      atualizaInformacoesDaPagina(dados);
      atualizando_pelo_servidor = false;

      setTimeout(atualizaLocalmente, DELAY_ATUALIZACAO_LOCAL);
      setTimeout(atualizaPeloServidor, DELAY_ATUALIZACAO_SERVIDOR);
    });
  });  
}

// Quando a página for carregada, chama...
atualizaPeloServidor();