export const brokerUrl = process.env.MQTT_URL ?? "mqtt://localhost:1883";
export const statusTopic = "estufa/status";
export const telemetryTopic = "estufa/telemetria";
export const qos = 1;
