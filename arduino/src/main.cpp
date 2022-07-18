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
boolean timerOn;

void readConfig(boolean &timerOn)
{
  USE_SERIAL.println(F("Start mounted file..."));
  if (!SPIFFS.begin())
  {
    USE_SERIAL.println(F("Can't mounted file system"));
    return;
  }
  if (SPIFFS.exists(F("/config.json")))
  {
    USE_SERIAL.println(F("Reading config file"));
    File configFile = SPIFFS.open("/config.json", "r");
    if (configFile)
    {
      USE_SERIAL.print(F("Opened config file: "));
      size_t size = configFile.size();
      std::unique_ptr<char[]> buf(new char[size]);
      configFile.readBytes(buf.get(), size);
      StaticJsonDocument<50> doc;
      DeserializationError error = deserializeJson(doc, buf.get());
      if (!error)
      {
        serializeJson(doc, USE_SERIAL);
        USE_SERIAL.println();
        timerOn = doc["timerOn"];
      }
      else
      {
        USE_SERIAL.println(F("Failed to load json config"));
      }
    }
    return;
  }
}

void saveConfig(const char *conf)
{
  USE_SERIAL.println(F("Start mounted file..."));
  if (!SPIFFS.begin())
  {
    USE_SERIAL.println(F("Can't mounted file system"));
    return;
  }
  StaticJsonDocument<50> doc;
  DeserializationError error = deserializeJson(doc, conf);
  if (!error)
  {
    USE_SERIAL.println(F("Saving config"));
    File configFile = SPIFFS.open("/config.json", "w");
    if (!configFile)
    {
      USE_SERIAL.println(F("Failed to open config file for writing"));
      return;
    }
    serializeJson(doc, configFile);
    configFile.close();
    USE_SERIAL.println(F("Save config file successfuly"));
    readConfig(timerOn);
  }
  else
  {
    USE_SERIAL.println(F("Failed to load json config"));
  }
}

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

void syncSetting(const char *payload, size_t size)
{
  saveConfig(payload);
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
  readConfig(timerOn);
  webSocket.on("sync-setting", syncSetting);
  webSocket.on("sync-trigger", syncTrigger);
  webSocket.begin("autopump.herokuapp.com", 80, "/socket.io/?transport=websocket");
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
    if (!timerOn)
    {
      Serial.println(F("Timer is off. Start auto trigger from local"));
    }
    syncData(temperature, airHumidity, soilMoisture, pumpState);
    time1 = millis();
  }
}