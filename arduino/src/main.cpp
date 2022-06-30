#include <FS.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <SocketIoClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define PIN_OUT D4
#define DHT_PIN D7
#define DHT_TYPE DHT22
#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;
DHT dht(DHT_PIN, DHT_TYPE);

unsigned long time1 = 0;
float soilMoisture;
float airHumidity;
float temperature;

void triggerAction(const char *data)
{
  USE_SERIAL.println(F("Start trigger action..."));
  StaticJsonDocument<50> doc;
  DeserializationError error = deserializeJson(doc, data);
  if (!error)
  {
    boolean isOn = doc["isOn"];
    const byte state = isOn ? HIGH : LOW;
    digitalWrite(PIN_OUT, state);
    USE_SERIAL.println(F("Trigger action successfuly"));
  }
  else
  {
    USE_SERIAL.println(F("Failed to load json data"));
  }
}

void syncData(const float &temp, const float &ariHumi, const float &soilMois, const boolean &pumpState)
{
  StaticJsonDocument<200> doc;
  doc["temperature"] = temp;
  doc["airHumidity"] = ariHumi;
  doc["soilMoisture"] = soilMois;
  doc["pumpState"] = pumpState;
  String str;
  serializeJson(doc, str);
  int len = 0;
  while (str[len] != NULL)
  {
    len++;
  }
  char strEmit[len + 1];
  str.toCharArray(strEmit, len + 1);
  webSocket.emit("sync-data", strEmit);
}

void syncTrigger(const char *payload, size_t size)
{
  triggerAction(payload);
}

void setup()
{
  USE_SERIAL.begin(115200);
  USE_SERIAL.setDebugOutput(true);
  for (uint8_t t = 4; t > 0; t--)
  {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  WiFiMulti.addAP("NguyenDucThang1", "888888888");

  while (WiFiMulti.run() != WL_CONNECTED)
  {
    delay(100);
  }
  pinMode(PIN_OUT, OUTPUT);
  digitalWrite(PIN_OUT, 0);
  lcd.init();
  lcd.backlight();
  dht.begin();
  webSocket.on("sync-trigger", syncTrigger);
  webSocket.begin("192.168.1.16", 8080, "/socket.io/?transport=websocket");
}

void loop()
{
  webSocket.loop();
  if (millis() - time1 >= 5000)
  {
    temperature = dht.readTemperature();
    airHumidity = dht.readHumidity();
    soilMoisture = random(80, 100);
    const boolean pumpState = digitalRead(PIN_OUT) == LOW ? false : true;
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp:");
    lcd.setCursor(0, 1);
    lcd.print(temperature);
    lcd.print("*C");
    syncData(temperature, airHumidity, soilMoisture, pumpState);
    time1 = millis();
  }
}