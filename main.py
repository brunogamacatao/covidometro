# coding: utf-8
import json
import time
import datetime as dt
from threading import Thread
from dados import load_covid_data

# carregamos os dados
print('Carregando os dados do MS ...')
results = json.loads(load_covid_data())['results']

DT_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'
ULTIMA_ATUALIZACAO = dt.datetime.strptime('2020-05-03T20:11:56.322Z', results[-1]['updatedAt'])
SEGUNDOS_EM_UM_DIA = 86400
TOTAL_OBITOS      = int(results[-1]['qtd_obito'])
TOTAL_CASOS       = int(results[-1]['qtd_confirmado'])
NOVOS_OBITOS      = TOTAL_OBITOS - int(results[-2]['qtd_obito'])
NOVOS_CASOS       = TOTAL_CASOS - int(results[-2]['qtd_confirmado'])

print('Total de casos: ' + str(TOTAL_CASOS) + ' - novos casos: ' + str(NOVOS_CASOS))
print('Total de óbitos: ' + str(TOTAL_OBITOS) + ' - novos óbitos: ' + str(NOVOS_OBITOS))

class MeuThread(Thread):
  def __init__(self):
    Thread.__init__(self)
    global SEGUNDOS_EM_UM_DIA
    global NOVOS_OBITOS
    global NOVOS_CASOS
    self.taxa_o = float(NOVOS_OBITOS) / SEGUNDOS_EM_UM_DIA
    self.taxa_c = float(NOVOS_CASOS) / SEGUNDOS_EM_UM_DIA
  
  def run(self):
    global ULTIMA_ATUALIZACAO
    global TOTAL_OBITOS
    global TOTAL_CASOS

    while True:
      agora = dt.datetime.now()
      delta_t = (agora - ULTIMA_ATUALIZACAO).seconds
      o = int(TOTAL_OBITOS + self.taxa_o * delta_t)
      c = int(TOTAL_CASOS + self.taxa_c * delta_t)
      print('Casos: ' + str(c) + ' - Obitos: ' + str(o) + ' - casos/seg ' + str(self.taxa_c) + ' - obitos/seg ' + str(self.taxa_o))
      time.sleep(1)

if __name__ == "__main__":
  t = MeuThread()
  t.daemon = True
  t.start()

  while True:
    time.sleep(1)