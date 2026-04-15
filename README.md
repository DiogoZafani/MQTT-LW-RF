# Trabalho MQTT: LWT e Retain Flag

Este repositorio foi preparado para demonstrar, na pratica, dois recursos do MQTT:

- `Last Will and Testament (LWT)`
- `Retain Flag`

A ideia da demonstracao e simples:

- um dispositivo publica seu status no topico `casa/temperatura`
- um monitor se inscreve nesse topico para acompanhar o que acontece

## O que foi implementado

- `sensorTemperatura.js`: simula um sensor de temperatura
- `monitorTemperatura.js`: observa as mensagens do topico de status
- `docker-compose.yml`: sobe o broker Mosquitto

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Suba o broker:

```bash
npm run broker
```

3. Em um terminal, rode o monitor:

```bash
npm run monitor
```

4. Em outro terminal, rode o sensor:

```bash
npm run sensor
```

## Como demonstrar o Retain Flag

Quando o `sensor` conecta, ele publica uma mensagem `online` no topico `casa/temperatura` com `retain: true`.

Depois disso, abra outro terminal e rode o monitor novamente:

```bash
npm run monitor -- monitor-2
```

Esse segundo monitor vai receber imediatamente a ultima mensagem publicada, mesmo tendo entrado depois.

Isso mostra o funcionamento do `retain`: o broker guarda a ultima mensagem daquele topico e entrega para novos subscribers.

## Como demonstrar o Last Will and Testament

O `sensor` tambem foi configurado com um `LWT`.

Agora, no terminal do sensor, pressione `Ctrl+C`.

O script encerra sem mandar um `DISCONNECT` normal. Com isso, o broker entende que a conexao caiu de forma inesperada e publica automaticamente uma mensagem `offline`.

Essa mensagem aparece no `monitor`, mostrando o funcionamento do `Last Will and Testament`.

## Quando usar cada um

### Quando usar LWT

O `LWT` deve ser usado quando o sistema precisa perceber rapidamente que um dispositivo caiu ou perdeu conexao.

Exemplos:

- sensor que saiu da rede
- camera offline
- gateway que perdeu energia
- controlador que travou

### Quando usar Retain

O `retain` deve ser usado quando um novo subscriber precisa receber imediatamente o ultimo estado conhecido de um topico.

Exemplos:

- status atual de um dispositivo
- ultimo valor de temperatura
- estado de uma bomba de agua
- estado de uma lampada ou rele

## Impactos em um sistema IoT real

### Impactos do LWT

Em um sistema IoT real, o `LWT` ajuda a detectar falhas de comunicacao com mais rapidez.

Impactos praticos:

- dashboards mostram dispositivos offline de forma mais confiavel
- alertas podem ser gerados automaticamente
- o sistema reage mais rapido a falhas
- facilita monitoramento e manutencao

### Impactos do Retain

Em um sistema IoT real, o `retain` evita que novos consumidores entrem no sistema sem contexto.

Impactos praticos:

- interfaces carregam com o estado mais recente
- sistemas nao precisam esperar uma nova publicacao
- reduz atraso para sincronizar estado
- melhora consistencia entre dispositivos e aplicacoes

## Observacao sobre o QoS usado

O foco deste trabalho e `LWT` e `retain`, nao comparacao de `QoS`.

Por isso, foi usado `QoS 1` no topico de status, pois ele oferece um equilibrio bom para esse tipo de demonstracao: a mensagem tem confirmacao de entrega sem adicionar a complexidade do `QoS 2`.

## Encerrar o broker

```bash
npm run broker:down
```
