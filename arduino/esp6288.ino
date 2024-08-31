#include <ArduinoJson.h>
// WiFi
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

const char* ssid = "AiLoan02";
const char* password = "mancityvodich";
const char* ipAd = "192.168.1.16";
const int port = 3000;

// LCD
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define I2C_ADDR 0x27
#define LCD_COLS 20
#define LCD_ROWS 4

LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLS, LCD_ROWS);

int infoMode = 0;

const char* teamDesc[] = {
  "TEAM 1: ACG",
  "AUTO PARKING LOT"
};
// Slot
const int maxSlots = 4;
bool isFullSlots = false;

bool slots[maxSlots] = {false, false, false, false};
// Data to print
const char* studentNames[] = {
  "Ho va ten:",
  "Nguyen The Anh",
  "Nguyen Van Cong",
  "Nguyen Truong Giang"
};

const char* studentCodes[] = {
  "Ma sinh vien:",
  "CT060202",
  "CT060206",
  "CT060211"
};

// Helper function to parse JSON
bool parseJson(StaticJsonDocument<200>& doc, const char* payload, size_t length) {
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    lcd.print("ERROR TRY AGAIN!");
    delay(3000);
    return false;
  }
  return true;
}

// Listen action

void isFullCheck(const char *payload, size_t length) {
  StaticJsonDocument<200> doc;
  if (parseJson(doc, payload, length)) {
    isFullSlots = doc["isFull"];
  }
}

void onInvalidCardIn(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Invalid card!");
  delay(3000);
  Serial.println("#02");
  handlePrint();
}

void onInvalidCardOut(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Invalid card!");
  delay(3000);
  Serial.println("#03");
  handlePrint();
}

void onValidCardGuestIn(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Welcome!");
  delay(3000);
  Serial.println("#00");
  handlePrint();
}

void onValidCardGuestOut(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  StaticJsonDocument<200> doc;
  if (parseJson(doc, payload, length)) {
    const char* money = doc["money"];
    lcd.print("BYE!");
    lcd.setCursor(0, 2);
    lcd.print("Money: ");
    lcd.setCursor(0, 3);
    lcd.print(money);
    delay(3000);
    Serial.print("#01");
  } else {
    lcd.println("ERROR TRY AGAIN!");
    delay(3000);
    Serial.println("#03");
  }
  handlePrint();
}

void onCardInUse(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("The card is already in use");
  delay(3000);
  Serial.println("#02");
  handlePrint();
}

void onCardIsNotInUse(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("The card is not in use");
  delay(3000);
  Serial.println("#03");
  handlePrint();
}

void onCardInCannotFindUser(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Cannot find user");
  delay(3000);
  Serial.println("#02");
  handlePrint();
}

void onCardOutCannotFindUser(const char *payload, size_t length) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Cannot find user");
  delay(3000);
  Serial.println("#03");
  handlePrint();
}

void onCheckInUserSuccess(const char *payload, size_t length) {
  StaticJsonDocument<200> doc;
  lcd.clear();
  lcd.setCursor(0, 0);
  if (parseJson(doc, payload, length)) {
    const char* name = doc["name"];
    lcd.print("WELCOME!");
    lcd.setCursor(0, 2);
    lcd.print(name);
    delay(3000);
    Serial.print("#00");
  } else {
    lcd.print("ERROR TRY AGAIN!");
    delay(3000);
    Serial.println("#02");
  }
  handlePrint();
}

void onCheckOutUserSuccess(const char *payload, size_t length) {
  StaticJsonDocument<200> doc;
  lcd.clear();
  lcd.setCursor(0, 0);
  if (parseJson(doc, payload, length)) {
    const char* name = doc["name"];
    lcd.print("BYE!");
    lcd.setCursor(0, 2);
    lcd.print(name);
    delay(3000);
    Serial.print("#01");
  } else {
    lcd.print("ERROR TRY AGAIN!");
    delay(3000);
    Serial.println("#03");
  }
  handlePrint();
}

// flame warning
#define flameSensorPin D5
#define buzzerPin1 D3
#define buzzerPin2 D4

void canhBaoChay() {
  int flameDetected = digitalRead(flameSensorPin);
  if (flameDetected == LOW) { // Tín hiệu LOW nghĩa là phát hiện lửa
    Serial.println("#04");
    webSocket.emit("flame-on");
    digitalWrite(buzzerPin1, HIGH);
    digitalWrite(buzzerPin2, HIGH);

    while (digitalRead(flameSensorPin) == LOW) {
      delay(3000);
    }

    digitalWrite(buzzerPin1, LOW);
    digitalWrite(buzzerPin2, LOW);
  }
}

void setup() {
  // init serial
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  delay(1000);

  // init LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();

  // init flame sensor
  pinMode(flameSensorPin, INPUT);
  pinMode(buzzerPin1, OUTPUT);
  pinMode(buzzerPin2, OUTPUT);

  // init WiFi
  WiFiMulti.addAP(ssid, password);
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  // listen emit action here
  webSocket.on("invalid-check-in-card", onInvalidCardIn);
  webSocket.on("check-in-guest-success", onValidCardGuestIn);
  webSocket.on("check-in-card-in-use", onCardInUse);
  webSocket.on("invalid-check-in-user", onCardInCannotFindUser);
  webSocket.on("check-in-user-success", onCheckInUserSuccess);
  webSocket.on("invalid-check-out-card", onInvalidCardOut);
  webSocket.on("check-out-card-is-not-in-use", onCardIsNotInUse);
  webSocket.on("check-out-guest-success", onValidCardGuestOut);
  webSocket.on("invalid-check-out-user", onCardOutCannotFindUser);
  webSocket.on("check-out-user-success", onCheckOutUserSuccess);
  webSocket.on("full-status", isFullCheck);

  webSocket.begin(ipAd, port);

  // print (first time) to LCD
  handlePrint();
}

void loop() {
  webSocket.loop();

  handleReceiveData();

  canhBaoChay();
}
// Print

void prindTeam() {
  lcd.setCursor(4, 0);
  lcd.print(teamDesc[0]);
  lcd.setCursor(2, 2);
  lcd.print(teamDesc[1]);
}

void printName() {
  lcd.setCursor(0, 0);
  lcd.print(studentNames[0]);  // In tên sinh viên 1
  lcd.setCursor(0, 1);
  lcd.print(studentNames[1]);  // In mã sinh viên 1
  lcd.setCursor(0, 2);
  lcd.print(studentNames[2]);  // In tên sinh viên 2
  lcd.setCursor(0, 3);
  lcd.print(studentNames[3]);  // In tên sinh viên 2
}

void printStudentCode() {
  lcd.setCursor(0, 0);
  lcd.print(studentCodes[0]);
  lcd.setCursor(0, 1);
  lcd.print(studentCodes[1]);
  lcd.setCursor(0, 2);
  lcd.print(studentCodes[2]);
  lcd.setCursor(0, 3);
  lcd.print(studentCodes[3]);  
}

void printSlotsStatus() {
  String status[maxSlots];
  for (int i = 0; i < maxSlots; i++) {
    status[i] = slots[i] == 1 ? "full" : "empty";
  }

  lcd.setCursor(7, 0);
  lcd.print("Status");

  lcd.setCursor(0, 1);
  lcd.print("S1: " + status[0]);
  
  lcd.setCursor(10, 1);
  lcd.print("S2: " + status[1]);

  lcd.setCursor(0, 3);
  lcd.print("S3: " + status[2]);

  lcd.setCursor(10, 3);
  lcd.print("S4: " + status[3]); 
}

void handlePrint() {
  lcd.clear();
  switch(infoMode) {
    case 0:
      prindTeam();
      break;
    case 1:
      printName();
      break;
    case 2:
      printStudentCode();
      break;
    case 3: 
      printSlotsStatus();
      break;
    default:
      lcd.setCursor(0, 0);
      lcd.print("Invalid InfoMode");
  }
}
// handle receive data from adruino
void handleReceiveData() {
  if (Serial.available() > 0) {
    String receivedData = Serial.readStringUntil('\n'); 
    if (receivedData.startsWith("#00")) {
      infoMode = 0;
    } else if(receivedData.startsWith("#01")) {
      infoMode = 1;
    } else if(receivedData.startsWith("#02")) {
      infoMode = 2;
    } else if(receivedData.startsWith("#03")) {
      infoMode = 3;
    } else if(receivedData.startsWith("#04")) {
      String data = receivedData.substring(3);
      handleUpdateStatusSlot(data);
    } else if(receivedData.startsWith("#05")) {
      if(isFullSlots) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("PARKING LOT IS FULL!");

        delay(2000);
        Serial.println("#02");
      } else {
        String data = receivedData.substring(3);
        handleEmitCardIn(data);
      }
    } else if(receivedData.startsWith("#06")) {
      String data = receivedData.substring(3);
      handleEmitCardOut(data);
    } else if(receivedData.startsWith("#07")) {
      webSocket.emit("open-in");
    } else if(receivedData.startsWith("#08")) {
      webSocket.emit("close-in");
    } else if(receivedData.startsWith("#09")) {
      webSocket.emit("open-out");
    } else if(receivedData.startsWith("#10")) {
      webSocket.emit("close-out");
    }
    handlePrint();
  }
}

void handleUpdateStatusSlot(String data) {
  if(data.length() < 4) return;
  for (int i = 0; i < maxSlots; i++) {
    slots[i]  = (data[i] == '1');
  }
  StaticJsonDocument<200> doc;
  doc["data"] = data;
  String jsonStr;
  serializeJson(doc, jsonStr);
  webSocket.emit("update", jsonStr.c_str());
}

void handleEmitCardIn(String uid) {
  StaticJsonDocument<200> doc;
  doc["uid"] = uid;
  String jsonStr;
  serializeJson(doc, jsonStr);
  webSocket.emit("check-in", jsonStr.c_str());
}

void handleEmitCardOut(String uid) {
  StaticJsonDocument<200> doc;
  doc["uid"] = uid;
  String jsonStr;
  serializeJson(doc, jsonStr);
  webSocket.emit("check-out", jsonStr.c_str());
}