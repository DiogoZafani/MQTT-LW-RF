import mqtt from "mqtt";
import { brokerUrl, qos, statusTopic, telemetryTopic } from "./topics.js";

const deviceId = process.argv[2] ?? "sensor-estufa-01";

const client = mqtt.connect(brokerUrl, {
  clientId: deviceId,
  keepalive: 5,
  reconnectPeriod: 0,
  will: {
    topic: statusTopic,
    payload: JSON.stringify({
      deviceId,
      status: "offline",
      source: "broker-lwt"
    }),
    qos,
    retain: true
  }
});

client.on("connect", () => {
  console.log(`[${deviceId}] conectado ao broker em ${brokerUrl}`);

  publishStatus("online", "device-startup", () => {
    publishTelemetry();
    setInterval(publishTelemetry, 3000);
  });
});

client.on("error", (error) => {
  console.error(`[${deviceId}] erro no cliente MQTT:`, error.message);
});

client.on("close", () => {
  console.log(`[${deviceId}] conexao encerrada`);
});

process.on("SIGINT", () => {
  console.log(`\n[${deviceId}] encerrando sem DISCONNECT para disparar o LWT...`);
  process.exit(130);
});

process.on("SIGTERM", () => {
  console.log(`\n[${deviceId}] finalizado sem DISCONNECT para disparar o LWT...`);
  process.exit(143);
});

function publishStatus(status, source, onDone) {
  const payload = JSON.stringify({
    deviceId,
    status,
    source,
    at: new Date().toISOString()
  });

  client.publish(statusTopic, payload, { qos, retain: true }, (error) => {
    if (error) {
      console.error(`[${deviceId}] falha ao publicar status:`, error.message);
      return;
    }

    console.log(`[${deviceId}] status publicado em ${statusTopic} com retain=true`);
    console.log(payload);

    if (onDone) {
      onDone();
    }
  });
}

function publishTelemetry() {
  const payload = JSON.stringify({
    deviceId,
    temperaturaC: randomBetween(18, 32),
    umidadePercent: randomBetween(45, 80),
    at: new Date().toISOString()
  });

  client.publish(telemetryTopic, payload, { qos, retain: false }, (error) => {
    if (error) {
      console.error(`[${deviceId}] falha ao publicar telemetria:`, error.message);
      return;
    }

    console.log(`[${deviceId}] telemetria enviada para ${telemetryTopic}`);
    console.log(payload);
  });
}

function randomBetween(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}
