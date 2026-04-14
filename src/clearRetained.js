import mqtt from "mqtt";
import { brokerUrl, qos, statusTopic } from "./topics.js";

const client = mqtt.connect(brokerUrl, {
  clientId: `clear-retained-${Date.now()}`,
  reconnectPeriod: 0
});

client.on("connect", () => {
  client.publish(statusTopic, "", { qos, retain: true }, (error) => {
    if (error) {
      console.error("Falha ao limpar retained message:", error.message);
      process.exitCode = 1;
    } else {
      console.log(`Retained message removida de ${statusTopic}`);
    }

    client.end();
  });
});

client.on("error", (error) => {
  console.error("Erro no cliente MQTT:", error.message);
  process.exitCode = 1;
});
