import mqtt from "mqtt";
import { MQTT_URL, QOS, STATUS_TOPIC } from "./mqttConfig.js";

const SENSOR_ID = process.argv[2] ?? "sensor-temperatura-01";
const PUBLISH_INTERVAL_MS = 5_000;
let publishInterval;

const client = mqtt.connect(MQTT_URL, {
  clientId: SENSOR_ID,
  keepalive: 5,
  reconnectPeriod: 0,
  will: {
    topic: STATUS_TOPIC,
    payload: JSON.stringify({
      sensorId: SENSOR_ID,
      status: "offline",
      source: "broker-lwt"
    }),
    qos: QOS,
    retain: true
  }
});

client.on("connect", () => {
  console.log(`[${SENSOR_ID}] conectado em ${MQTT_URL}`);
  publishStatus("online", "sensor-startup");
  startPublishing();
});

client.on("error", (error) => {
  console.error(`[${SENSOR_ID}] erro:`, error.message);
});

process.on("SIGINT", () => {
  console.log(`\n[${SENSOR_ID}] encerrando sem DISCONNECT para disparar o LWT...`);
  process.exit(130);
});

process.on("SIGTERM", () => {
  console.log(`\n[${SENSOR_ID}] finalizado sem DISCONNECT para disparar o LWT...`);
  process.exit(143);
});

function startPublishing() {
  clearInterval(publishInterval);

  publishInterval = setInterval(() => {
    publishStatus("online", "sensor-heartbeat");
  }, PUBLISH_INTERVAL_MS);
}

function publishStatus(status, source) {
  const payload = JSON.stringify({
    sensorId: SENSOR_ID,
    status,
    source,
    at: new Date().toISOString()
  });

  client.publish(STATUS_TOPIC, payload, { qos: QOS, retain: true }, (error) => {
    if (error) {
      console.error(`[${SENSOR_ID}] falha ao publicar status:`, error.message);
      return;
    }

    console.log(`[${SENSOR_ID}] status publicado em ${STATUS_TOPIC}`);
    console.log(payload);
  });
}
