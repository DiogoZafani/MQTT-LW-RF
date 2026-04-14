import mqtt from "mqtt";
import { brokerUrl, qos, statusTopic, telemetryTopic } from "./topics.js";

const monitorId =
  process.argv[2] ?? `monitor-${Math.random().toString(16).slice(2, 8)}`;

const client = mqtt.connect(brokerUrl, {
  clientId: monitorId,
  reconnectPeriod: 0
});

client.on("connect", () => {
  console.log(`[${monitorId}] conectado ao broker em ${brokerUrl}`);
  console.log(`[${monitorId}] assinando ${statusTopic} e ${telemetryTopic}`);

  client.subscribe([statusTopic, telemetryTopic], { qos }, (error) => {
    if (error) {
      console.error(`[${monitorId}] falha ao assinar topicos:`, error.message);
      return;
    }

    console.log(`[${monitorId}] aguardando mensagens...`);
  });
});

client.on("message", (topic, payload, packet) => {
  const body = formatPayload(payload);

  console.log("");
  console.log(`[${monitorId}] mensagem recebida`);
  console.log(`topico : ${topic}`);
  console.log(`retain : ${packet.retain}`);
  console.log(`qos    : ${packet.qos}`);
  console.log(`dup    : ${packet.dup}`);
  console.log(`payload: ${body}`);
});

client.on("error", (error) => {
  console.error(`[${monitorId}] erro no cliente MQTT:`, error.message);
});

function formatPayload(payload) {
  const text = payload.toString();

  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
