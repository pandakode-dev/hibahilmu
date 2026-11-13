// app/components/simulator/wokwiMicroPythonData.ts
import { ExtendedLessonStepIoT } from "./wokwiAcademyBlueprints";

export interface PaketMateriMicroPython {
  kodeTemplatePy: string;
  kodeTargetPy: string;
  instruksiKetikPy: string[];
}

// Konverter & Database Kurikulum MicroPython (main.py) untuk seluruh Level IoT ESP32
export function ambilMateriMicroPython(
  materi: ExtendedLessonStepIoT,
  isModeLatihanMandiri: boolean
): PaketMateriMicroPython {
  const judul = (materi.judulMateri || "").toLowerCase();

  // Tentukan nomor pin berdasarkan mode (Terpandu vs Latihan Mandiri yang dirotasi pinnya)
  const pinLedUtama = isModeLatihanMandiri ? 15 : 2;
  const pinLedKedua = isModeLatihanMandiri ? 4 : 15;
  const pinTombol = isModeLatihanMandiri ? 13 : 4;
  const pinAdcLdrPot = isModeLatihanMandiri ? 35 : 34;
  const pinRelay = isModeLatihanMandiri ? 27 : 26;
  const pinServo = isModeLatihanMandiri ? 25 : 13;
  const pinSolenoidSonar = isModeLatihanMandiri ? 26 : 27;
  const pinDht = isModeLatihanMandiri ? 4 : 15;
  const pinKipas = isModeLatihanMandiri ? 26 : 33;
  const pinPompa = isModeLatihanMandiri ? 33 : 25;
  const pinMq2 = isModeLatihanMandiri ? 34 : 32;
  const pinBuzzer = isModeLatihanMandiri ? 27 : 19;
  const jedaMs = isModeLatihanMandiri ? 500 : 1000;

  // 1. MODUL LAMPU LALU LINTAS MULTI-LED
  if (judul.includes("lalu lintas")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Lampu Lalu Lintas Multi-LED
from machine import Pin
import time

# 1. Definisikan led_merah di Pin(${pinLedUtama}, Pin.OUT) dan led_hijau di Pin(${pinLedKedua}, Pin.OUT):


while True:
  # 2. Nyalakan merah (value(1)) & matikan hijau (value(0)), beri time.sleep_ms(${jedaMs}), lalu balik!
  `,
      kodeTargetPy: `from machine import Pin
import time

led_merah = Pin(${pinLedUtama}, Pin.OUT)
led_hijau = Pin(${pinLedKedua}, Pin.OUT)

while True:
  led_merah.value(1)
  led_hijau.value(0)
  time.sleep_ms(${jedaMs})
  led_merah.value(0)
  led_hijau.value(1)
  time.sleep_ms(${jedaMs})`,
      instruksiKetikPy: [
        `Impor modul: from machine import Pin dan import time`,
        `Buat objek: led_merah = Pin(${pinLedUtama}, Pin.OUT) dan led_hijau = Pin(${pinLedKedua}, Pin.OUT)`,
        `Di dalam while True:, atur pergantian led_merah.value(1) dan led_hijau.value(1) dengan time.sleep_ms(${jedaMs})`,
      ],
    };
  }

  // 2. MODUL PUSH BUTTON INPUT / EXTERNAL INTERRUPT
  if (judul.includes("button") || judul.includes("tombol") || judul.includes("interrupt")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Input Push Button & Output LED
from machine import Pin
import time

# 1. Buat objek tombol di Pin(${pinTombol}, Pin.IN, Pin.PULL_UP) dan led di Pin(${pinLedUtama}, Pin.OUT):


while True:
  # 2. Jika tombol.value() == 0 maka nyalakan led.value(1), selain itu led.value(0):
  `,
      kodeTargetPy: `from machine import Pin
import time

tombol = Pin(${pinTombol}, Pin.IN, Pin.PULL_UP)
led = Pin(${pinLedUtama}, Pin.OUT)

while True:
  if tombol.value() == 0:
    led.value(1)
  else:
    led.value(0)
  time.sleep_ms(100)`,
      instruksiKetikPy: [
        `Deklarasikan tombol = Pin(${pinTombol}, Pin.IN, Pin.PULL_UP) dan led = Pin(${pinLedUtama}, Pin.OUT)`,
        `Di dalam while True:, cek if tombol.value() == 0: lalu nyalakan led.value(1)`,
      ],
    };
  }

  // 3. MODUL POTENSIOMETER ADC + PWM LED
  if (judul.includes("potensiometer") || judul.includes("pulse width modulation")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Pembacaan ADC & Sinyal PWM LED
from machine import Pin, ADC, PWM
import time

# 1. Siapkan adc = ADC(Pin(${pinAdcLdrPot})) dan pwm_led = PWM(Pin(${pinLedUtama}), freq=1000):


while True:
  # 2. Baca nilai = adc.read() lalu atur kecerahan dengan pwm_led.duty(nilai // 4):
  `,
      kodeTargetPy: `from machine import Pin, ADC, PWM
import time

adc = ADC(Pin(${pinAdcLdrPot}))
pwm_led = PWM(Pin(${pinLedUtama}), freq=1000)

while True:
  nilai = adc.read()
  pwm_led.duty(nilai // 4)
  time.sleep_ms(200)`,
      instruksiKetikPy: [
        `Impor Pin, ADC, PWM dari pustaka machine`,
        `Inisialisasi adc = ADC(Pin(${pinAdcLdrPot})) dan pwm_led = PWM(Pin(${pinLedUtama}), freq=1000)`,
        `Baca nilai = adc.read() dan kirim siklus kerja pwm_led.duty(nilai // 4)`,
      ],
    };
  }

  // 4. MODUL SENSOR CAHAYA LDR + RELAY LAMPU JALAN
  if (judul.includes("ldr") || judul.includes("lampu jalan")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Sensor Cahaya LDR & Sakelar Relay Otomatis
from machine import Pin, ADC
import time

# 1. Siapkan ldr = ADC(Pin(${pinAdcLdrPot})) dan relay = Pin(${pinRelay}, Pin.OUT):


while True:
  # 2. Baca cahaya = ldr.read() dan jika cahaya < 1000 nyalakan relay.value(1):
  `,
      kodeTargetPy: `from machine import Pin, ADC
import time

ldr = ADC(Pin(${pinAdcLdrPot}))
relay = Pin(${pinRelay}, Pin.OUT)

while True:
  cahaya = ldr.read()
  if cahaya < 1000:
    relay.value(1)
  else:
    relay.value(0)
  time.sleep_ms(${jedaMs})`,
      instruksiKetikPy: [
        `Buat objek ldr = ADC(Pin(${pinAdcLdrPot})) dan relay = Pin(${pinRelay}, Pin.OUT)`,
        `Baca cahaya = ldr.read() di dalam while True:`,
        `Gunakan if cahaya < 1000: untuk mengaktifkan relay.value(1)`,
      ],
    };
  }

  // 5. MODUL SERVO & SOLENOID / RFID / ULTRASONIK
  if (judul.includes("servo") || judul.includes("solenoid") || judul.includes("rfid") || judul.includes("ultrasonik")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Kendali Palang Servo PWM & Kunci Solenoid
from machine import Pin, PWM
import time

# 1. Siapkan servo = PWM(Pin(${pinServo}), freq=50) dan solenoid = Pin(${pinSolenoidSonar}, Pin.OUT):


while True:
  # 2. Buka kunci solenoid.value(1) dan putar servo.duty(77) (posisi 90 derajat):
  `,
      kodeTargetPy: `from machine import Pin, PWM
import time

servo = PWM(Pin(${pinServo}), freq=50)
solenoid = Pin(${pinSolenoidSonar}, Pin.OUT)

while True:
  solenoid.value(1)
  servo.duty(77)
  time.sleep_ms(${jedaMs})
  solenoid.value(0)
  servo.duty(26)
  time.sleep_ms(${jedaMs})`,
      instruksiKetikPy: [
        `Inisialisasi servo = PWM(Pin(${pinServo}), freq=50) dan solenoid = Pin(${pinSolenoidSonar}, Pin.OUT)`,
        `Aktifkan solenoid.value(1) dan atur sudut servo.duty(77) untuk membuka palang`,
      ],
    };
  }

  // 6. MODUL SMART GREENHOUSE (DHT22 + KIPAS + POMPA AIR)
  if (judul.includes("dht22") || judul.includes("greenhouse")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Smart Greenhouse DHT22, Kipas & Pompa
from machine import Pin
import dht
import time

# 1. Siapkan sensor = dht.DHT22(Pin(${pinDht})), kipas = Pin(${pinKipas}, Pin.OUT), pompa = Pin(${pinPompa}, Pin.OUT):


while True:
  # 2. Panggil sensor.measure(), baca suhu = sensor.temperature(), dan nyalakan kipas/pompa:
  `,
      kodeTargetPy: `from machine import Pin
import dht
import time

sensor = dht.DHT22(Pin(${pinDht}))
kipas = Pin(${pinKipas}, Pin.OUT)
pompa = Pin(${pinPompa}, Pin.OUT)

while True:
  sensor.measure()
  suhu = sensor.temperature()
  if suhu > 32:
    kipas.value(1)
    pompa.value(1)
  time.sleep_ms(${jedaMs})`,
      instruksiKetikPy: [
        `Impor modul dht dan machine.Pin`,
        `Buat objek sensor = dht.DHT22(Pin(${pinDht})), kipas = Pin(${pinKipas}, Pin.OUT), dan pompa = Pin(${pinPompa}, Pin.OUT)`,
        `Panggil sensor.measure() dan jika suhu > 32 nyalakan kipas.value(1) serta pompa.value(1)`,
      ],
    };
  }

  // 7. MODUL DETEKTOR GAS MQ-2 & SIRINE PEMADAM
  if (judul.includes("mq-2") || judul.includes("gas") || judul.includes("kebakaran")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Detektor Asap MQ-2 & Sirine Buzzer
from machine import Pin, ADC
import time

# 1. Siapkan mq2 = ADC(Pin(${pinMq2})), buzzer = Pin(${pinBuzzer}, Pin.OUT), pompa = Pin(${pinPompa}, Pin.OUT):


while True:
  # 2. Baca gas = mq2.read() dan jika gas >= 2000 nyalakan buzzer.value(1) dan pompa.value(1):
  `,
      kodeTargetPy: `from machine import Pin, ADC
import time

mq2 = ADC(Pin(${pinMq2}))
buzzer = Pin(${pinBuzzer}, Pin.OUT)
pompa = Pin(${pinPompa}, Pin.OUT)

while True:
  gas = mq2.read()
  if gas >= 2000:
    buzzer.value(1)
    pompa.value(1)
  time.sleep_ms(500)`,
      instruksiKetikPy: [
        `Siapkan mq2 = ADC(Pin(${pinMq2})), buzzer = Pin(${pinBuzzer}, Pin.OUT), dan pompa = Pin(${pinPompa}, Pin.OUT)`,
        `Baca gas = mq2.read() dan aktifkan alarm jika melampaui ambang batas`,
      ],
    };
  }

  // 8. MODUL WI-FI HIBAHILMU-GUEST / WEBSERVER / MESH
  if (judul.includes("wi-fi") || judul.includes("web server") || judul.includes("10-node") || judul.includes("multi-hop")) {
    return {
      kodeTemplatePy: `# 🐍 MicroPython (main.py) — Koneksi Jaringan Wi-Fi HibahIlmu-Guest
import network
import time

# 1. Aktifkan radio Wi-Fi Station dengan wlan = network.WLAN(network.STA_IF) dan wlan.active(True):


# 2. Hubungkan ke SSID "HibahIlmu-Guest" dengan wlan.connect("HibahIlmu-Guest", ""):
`,
      kodeTargetPy: `import network
import time

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while not wlan.isconnected():
  time.sleep_ms(500)

print("Terhubung ke HibahIlmu-Guest! IP:", wlan.ifconfig())`,
      instruksiKetikPy: [
        `Impor pustaka network dan time`,
        `Aktifkan interface Wi-Fi: wlan = network.WLAN(network.STA_IF) lalu wlan.active(True)`,
        `Sambungkan ke jaringan: wlan.connect("HibahIlmu-Guest", "") dan cetak wlan.ifconfig()`,
      ],
    };
  }

  // 9. DEFAULT: BLINK DIGITAL OUTPUT / TELEMETRI DASAR MICROPYTHON
  return {
    kodeTemplatePy: `# 🐍 MicroPython (main.py) — Kendali Digital GPIO ESP32
from machine import Pin
import time

# 1. Atur Pin ${pinLedUtama} sebagai keluaran: led = Pin(${pinLedUtama}, Pin.OUT)


while True:
  # 2. Nyalakan led.value(1), tunggu time.sleep_ms(${jedaMs}), lalu matikan led.value(0):
  `,
    kodeTargetPy: `from machine import Pin
import time

led = Pin(${pinLedUtama}, Pin.OUT)

while True:
  led.value(1)
  time.sleep_ms(${jedaMs})
  led.value(0)
  time.sleep_ms(${jedaMs})`,
    instruksiKetikPy: [
      `Impor kelas Pin dari modul machine dan modul time`,
      `Deklarasikan objek led = Pin(${pinLedUtama}, Pin.OUT)`,
      `Di dalam perulangan while True:, nyalakan led.value(1) dan matikan led.value(0) dengan jeda time.sleep_ms(${jedaMs})`,
    ],
  };
}