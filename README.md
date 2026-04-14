# MQTT LWT + Retain Demo

Este projeto mostra, na pratica, dois recursos importantes do MQTT:

- `Last Will and Testament (LWT)`
- `Retain Flag`

A ideia e simples: um dispositivo publica seu status e um monitor acompanha essas mensagens.

## O que tem no projeto

- `npm run device`: simula um dispositivo IoT
- `npm run monitor`: mostra as mensagens recebidas
- `npm run clear-retained`: limpa a ultima mensagem salva no broker
- `npm run broker`: sobe o Mosquitto com Docker

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

4. Em outro terminal, rode o dispositivo:

```bash
npm run device
```

## Como demonstrar o retain

Quando o `device` conecta, ele publica no topico `estufa/status` uma mensagem `online` com `retain=true`.

Agora abra mais um terminal e rode novamente:

```bash
npm run monitor
```

Esse novo monitor vai receber na hora a ultima mensagem de status, mesmo tendo entrado depois. Isso acontece porque o broker guardou a mensagem retida.

## Como demonstrar o LWT

O `device` foi configurado com um `LWT` no mesmo topico de status.

Agora, no terminal do `device`, pressione `Ctrl+C`.

Como o script termina sem avisar normalmente ao broker, o broker entende que a conexao caiu de forma inesperada e publica automaticamente a mensagem `offline`.

O monitor vai mostrar essa mudanca de status.

## Quando usar cada um

### LWT

Use `LWT` quando for importante detectar que um dispositivo caiu ou perdeu conexao.

Exemplos:

- sensor que parou de responder
- camera offline
- controlador que perdeu energia
- gateway desconectado

### Retain

Use `retain` quando um novo subscriber precisar receber imediatamente o ultimo estado conhecido de um topico.

Exemplos:

- ultimo status de um dispositivo
- modo atual de operacao
- ultima temperatura publicada
- estado atual de um rele ou lampada

## Impactos em um sistema IoT real

### Impacto do LWT

Sem `LWT`, o sistema pode demorar para perceber que um dispositivo caiu.

Com `LWT`, fica mais facil:

- detectar falhas rapidamente
- disparar alertas
- mostrar status real em dashboards
- automatizar acoes de contingencia

### Impacto do retain

Sem `retain`, quem entrar depois pode ficar sem contexto ate chegar uma nova mensagem.

Com `retain`, o sistema ganha:

- inicializacao mais rapida
- dashboards mais consistentes
- menos necessidade de esperar nova publicacao
- leitura imediata do ultimo estado conhecido
