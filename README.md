# MQTT LWT + Retain Demo

Demo pratica de MQTT focada em:

- `Last Will and Testament (LWT)`
- `retain flag`

O projeto sobe um broker Mosquitto com Docker e oferece tres scripts:

- `npm run device`: simula um dispositivo da estufa
- `npm run monitor`: observa as mensagens e mostra `retain`, `qos` e `dup`
- `npm run clear-retained`: limpa o status retido para reiniciar a demo

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Suba o broker:

```bash
npm run broker
```

3. Em um terminal, inicie o monitor:

```bash
npm run monitor
```

4. Em outro terminal, inicie o device:

```bash
npm run device
```

## O que a demo mostra

### 1. Retain flag

Quando o `device` conecta, ele publica `online` no topico `estufa/status` com:

- `qos: 1`
- `retain: true`

Agora abra um segundo monitor:

```bash
npm run monitor -- monitor-tarde
```

Esse novo subscriber recebe imediatamente o ultimo status salvo pelo broker. No log, a mensagem chega com `retain=true`, mostrando que ela veio do armazenamento de retained messages do broker.

### 2. Last Will and Testament

O `device` conecta com um `will` configurado no mesmo topico `estufa/status`:

- payload: `offline`
- `qos: 1`
- `retain: true`

Para demonstrar o LWT na pratica, encerre o processo do `device` com `Ctrl+C`.

O script foi feito para sair sem enviar `DISCONNECT`, entao o broker considera a queda inesperada e publica o `LWT`. O monitor deve mostrar um novo status `offline`, emitido pelo broker.

Se voce abrir outro monitor depois da queda, ele recebera imediatamente esse `offline`, porque o LWT tambem foi publicado com `retain=true`.

## Limpar o estado retido

Para apagar o status salvo no broker:

```bash
npm run clear-retained
```

Isso publica payload vazio com `retain=true` no topico de status, que e a forma padrao de limpar uma retained message.

## Topicos usados

- `estufa/status`
- `estufa/telemetria`
