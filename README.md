# 🧠 AI Günlük Asistanı

Bu uygulama, kullanıcının yazdığı günlük metnini analiz ederek **duygusunu belirleyen, özet çıkaran ve kullanıcıya kişisel öneriler sunan** bir günlük asistanıdır. Proje iki ana bölümden oluşur:

📱 **Mobil Uygulama (React Native)**  
💡 **AI Analiz Servisi (Node.js API)**

---

## 🚀 Özellikler

✔ 6 seviyeli duygu sınıflandırması (Çok Pozitif → Çok Negatif)  
✔ Özet + kişisel öneri üretimi  
✔ Renk + emoji ile ruh hali gösterimi  
✔ Tarih/saat etiketli analiz  
✔ AsyncStorage ile yerel veritabanı (kayıt saklama alt yapısı)

---

## 📌 Proje Yapısı

AI-Gunluk-Asistani/
├─ mobile/ # React Native uygulaması
└─ api/ # Node.js AI backend servisi

---

## 🛠 Kurulum ve Çalıştırma

### 🔹 Backend (API)

cd api
npm install
node server.js

### 🔸 Mobil Uygulama

cd mobile
npm install
npx react-native run-android

⚠️ Android emülatörü çalışıyor olmalıdır.

---

## 🧠 Kullanılan Teknolojiler

| Mobil        | Backend                      |
| ------------ | ---------------------------- |
| React Native | Node.js (Express)            |
| TypeScript   | REST JSON API                |
| AsyncStorage | Kelime tabanlı duygu analizi |

---

## 🙏 Not

Bu proje, yazılım geliştirme sürecini öğrenme amacıyla hazırlanmış olup; yapay zeka destekli mobil uygulamalar geliştirme sürecinin önemli prensiplerini içermektedir.
