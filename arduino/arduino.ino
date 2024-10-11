#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Servo.h>
#include <SPI.h>
#include <MFRC522.h>

// Pin Definitions
#define RX 7
#define TX 8
#define InServoPin 2
#define OutServoPin 3
#define BTN_SERVO_IN_PIN 4
#define BTN_SERVO_OUT_PIN 5
#define BTN_CONTROL_LCD 6
#define IR_IN_PIN A5
#define IR_CAR1_PIN A4
#define IR_CAR2_PIN A3
#define IR_CAR3_PIN A2
#define IR_CAR4_PIN A1
#define IR_OUT_PIN A0
#define SS_PIN 10
#define RST_PIN 9

// Threshold
const int threshold = 512;

// Create instances
SoftwareSerial espSerial(RX, TX);
Servo inServo, outServo;
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Variables
bool S1 = false, S2 = false, S3 = false, S4 = false;
bool isOpenInGate = false, isOpenOutGate = false;
bool lastInOpen = false, lastOutOpen = false;
int infoMode = 0;
String lastScanUidIn = "", lastScanUidOut = "";

void setup() {
  // Initialize Serial Communication
  Serial.begin(115200);
  espSerial.begin(115200);

  // Initialize RFID
  SPI.begin();
  mfrc522.PCD_Init();

  // Initialize Pins
  pinMode(BTN_SERVO_IN_PIN, INPUT_PULLUP);
  pinMode(BTN_SERVO_OUT_PIN, INPUT_PULLUP);
  pinMode(IR_IN_PIN, INPUT);
  pinMode(IR_CAR1_PIN, INPUT);
  pinMode(IR_CAR2_PIN, INPUT);
  pinMode(IR_CAR3_PIN, INPUT);
  pinMode(IR_CAR4_PIN, INPUT);
  pinMode(IR_OUT_PIN, INPUT);
  pinMode(BTN_CONTROL_LCD, INPUT_PULLUP);

  // Attach servos to pins
  inServo.attach(InServoPin);
  outServo.attach(OutServoPin);

  // Send initialization status to ESP8266
  espSerial.println("#040000");
}

void loop() {
  handleReceiveData();
  handleChangeInfoMode();
  handleServo();
  readSensors();
  readCard();
}

// Read RFID card and handle
void readCard() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String cardUID = getCardUID();
    
    if (analogRead(IR_IN_PIN) < threshold) {
      if (cardUID != lastScanUidIn) {
        espSerial.println("#05" + cardUID);
        lastScanUidIn = cardUID;
      }
    } else if (analogRead(IR_OUT_PIN) < threshold) {
      if (cardUID != lastScanUidOut) {
        espSerial.println("#06" + cardUID);
        lastScanUidOut = cardUID;
      }
    }
  }
}

String getCardUID() {
  String id = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    id += String(mfrc522.uid.uidByte[i], HEX);
  }
  return id;
}

// Handle changing info mode
void handleChangeInfoMode() {
  if (digitalRead(BTN_CONTROL_LCD) == LOW) {
    delay(25);
    infoMode = (infoMode + 1) % 4;
    espSerial.println("#0" + String(infoMode));
    
    // Wait until the button is released
    while (digitalRead(BTN_CONTROL_LCD) == LOW) {
      delay(25);
    }
  }
}

// Read sensors and send data to ESP8266 if there are changes
void readSensors() {
  delay(100);
  
  bool tempS1 = analogRead(IR_CAR1_PIN) < threshold; 
  bool tempS2 = analogRead(IR_CAR2_PIN) < threshold; 
  bool tempS3 = analogRead(IR_CAR3_PIN) < threshold;
  bool tempS4 = analogRead(IR_CAR4_PIN) < threshold;

  if (tempS1 != S1 || tempS2 != S2 || tempS3 != S3 || tempS4 != S4) {
    espSerial.println(String("#04") + tempS1 + tempS2 + tempS3 + tempS4);
    
    S1 = tempS1;
    S2 = tempS2;
    S3 = tempS3;
    S4 = tempS4;
  }
}

// Handle servo movements and gate logic
void handleServo() {
  handleServoMovement(BTN_SERVO_IN_PIN, inServo, lastInOpen, "#07", "#08");
  handleServoMovement(BTN_SERVO_OUT_PIN, outServo, lastOutOpen, "#09", "#10");
  handleAutoGate(IR_IN_PIN, inServo, isOpenInGate, "#07", "#08");
  handleAutoGate(IR_OUT_PIN, outServo, isOpenOutGate, "#09", "#10");
}

void handleServoMovement(int buttonPin, Servo &servo, bool &lastOpenState, const String &openCmd, const String &closeCmd) {
  if (digitalRead(buttonPin) == LOW) {
    servo.write(90);  // Open servo
    if (!lastOpenState) espSerial.println(openCmd);
    lastOpenState = true;
  } else {
    servo.write(0);  // Close servo
    if (lastOpenState) espSerial.println(closeCmd);
    lastOpenState = false;
  }
}

void handleAutoGate(int irPin, Servo &servo, bool &isGateOpen, const String &openCmd, const String &closeCmd) {
  if (analogRead(irPin) < threshold && isGateOpen) {
    servo.write(90);
    espSerial.println(openCmd);
    isGateOpen = false;
    
    while (analogRead(irPin) < threshold) {
      delay(25);
    }
    
    delay(2000);
    servo.write(0);
    espSerial.println(closeCmd);
  }
}

// Handle received data from ESP8266
void handleReceiveData() {
  if (espSerial.available() > 0) {
    String receivedData = espSerial.readStringUntil('\n');
    
    if (receivedData.startsWith("#00")) {
      isOpenInGate = true;
      lastScanUidIn = "";
    } else if (receivedData.startsWith("#01")) {
      isOpenOutGate = true;
      lastScanUidOut = "";
    } else if (receivedData.startsWith("#02")) {
      lastScanUidIn = "";
    } else if (receivedData.startsWith("#03")) {
      lastScanUidOut = "";
    } 
    // else if (receivedData.startsWith("#04")) {
    //   inServo.write(90);
    //   outServo.write(90);
    //   delay(5000);
    //   inServo.write(0);
    //   outServo.write(0);
    // }
  }
}
