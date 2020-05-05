# Covidômetro
Aplicação simples, baseada na ideia do Impostômetro, para mostrar um valor estimado, em tempo real, do número de casos e óbitos relacionados à pandemia de COVID19 no Brasil.

## Funcionamento
O covidômetro obtém os dados a partir do site do ministério da saúde e calcula:
* O número de novos casos (casos de ontem - casos de antes de ontem)
* O número de novos óbitos (óbitos ontem - óbitos antes de ontem)
* Taxa de novos casos por segundo (número de novos casos / segundos entre as divulgações de ontem e antes de ontem)
* Taxa de novos óbitos por segundo (número de novos óbitos / segundos entre as divulgações de ontem e antes de ontem)
* O cálculo é repetido a cada 1 segundo no browser e a cada 5 minutos uma nova requisição é feita ao servidor
A partir dessas informações é possível corrigir o total de casos e óbitos corrigidos de acordo com as taxas de novos casos de óbitos, respectivamente, a partir do tempo passado desde a última divulgação

## Requisitos
Para executar esse projeto é necessáiro:
* Python 3.6 ou superior
* PIP

## Instalando as dependências
```bash
pip install -r requirements.txt
```

## Como executar
```
python main.py
```
Em seguida, abra um navegador em http://localhost:5000
