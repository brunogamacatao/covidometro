# Covidômetro
Aplicação simples para mostrar um valor estimado, em tempo real do número de casos e óbitos relacionados à pandemia de COVID19 no Brasil

## Funcionamento
O covidômetro obtém os dados a partir do site do ministério da saúde e calcula:
* O número de novos casos (casos de ontem - casos de antes de ontem)
* O número de novos óbitos (óbitos ontem - óbitos antes de ontem)
* Taxa de novos casos por segundo (número de novos casos / segundos entre as divulgações de ontem e antes de ontem)
* Taxa de novos óbitos por segundo (número de novos óbitos / segundos entre as divulgações de ontem e antes de ontem)
A partir dessas informações é possível corrigir o total de casos e óbitos corrigidos de acordo com as taxas de novos casos de óbitos, respectivamente, a partir do tempo passado desde a última divulgação

## Como executar
python3 main.py
