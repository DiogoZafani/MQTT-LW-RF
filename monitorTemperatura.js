import mqtt from "mqtt";
import { MQTT_URL, QOS, STATUS_TOPIC } from "./mqttConfig.js";

const MONITOR_ID =
  process.argv[2] ?? `monitor-${Math.random().toString(16).slice(2, 8)}`;

const client = mqtt.connect(MQTT_URL, {
  clientId: MONITOR_ID,
  reconnectPeriod: 0
});

client.on("connect", () => {
  console.log(`[${MONITOR_ID}] conectado em ${MQTT_URL}`);

  client.subscribe(STATUS_TOPIC, { qos: QOS }, (error) => {
    if (error) {
      console.error(`[${MONITOR_ID}] falha ao assinar ${STATUS_TOPIC}:`, error.message);
      return;
    }

    console.log(`[${MONITOR_ID}] monitorando ${STATUS_TOPIC}`);
  });
});

client.on("message", (topic, payload, packet) => {
  console.log("");
  console.log(`[${MONITOR_ID}] mensagem recebida`);
  console.log(`topico : ${topic}`);
  console.log(`retain : ${packet.retain}`);
  console.log(`qos    : ${packet.qos}`);
  console.log(`payload: ${formatPayload(payload)}`);
});

client.on("error", (error) => {
  console.error(`[${MONITOR_ID}] erro:`, error.message);
});

function formatPayload(payload) {
  const text = payload.toString();

  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
