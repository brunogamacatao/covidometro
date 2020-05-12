import json
import time
import datetime as dt
from dados import load_covid_data

DT_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'
SEGUNDOS_EM_UM_DIA = 86400

def converte(item):
  global DT_FORMAT
  return {
      "createdAt": item['createdAt'], 
      "label": item['label'],
      "objectId": item['objectId'],
      "qtd_confirmado": item['qtd_confirmado'],
      "qtd_obito": item['qtd_obito'],
      "updatedAt": dt.datetime.strptime(item['updatedAt'], DT_FORMAT)
  }

def get_dados_atuais():
  global DT_FORMAT
  global SEGUNDOS_EM_UM_DIA
  
  results = map(converte, json.loads(load_covid_data())['results'])
  results = sorted(results, key=lambda x: x['updatedAt'])
  
  ultima_atualizacao = results[-1]['updatedAt']
  total_obitos       = int(results[-1]['qtd_obito'])
  total_casos        = int(results[-1]['qtd_confirmado'])
  novos_obitos       = total_obitos - int(results[-2]['qtd_obito'])
  novos_casos        = total_casos - int(results[-2]['qtd_confirmado'])

  obitos_por_segundo = float(novos_obitos) / SEGUNDOS_EM_UM_DIA
  casos_por_segundo  = float(novos_casos)  / SEGUNDOS_EM_UM_DIA

  agora   = dt.datetime.now()
  delta_t = (agora - ultima_atualizacao).seconds
  obitos  = int(total_obitos + obitos_por_segundo * delta_t)
  casos   = int(total_casos + casos_por_segundo * delta_t)

  return {
    "casos": casos, 
    "obitos": obitos, 
    "casos_por_segundo": casos_por_segundo,
    "obitos_por_segundo": obitos_por_segundo,
    "ultima_atualizacao": ultima_atualizacao.strftime("%d/%m/%Y %H:%M:%S")
  }
