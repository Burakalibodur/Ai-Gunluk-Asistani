# 📔 AI Günlük Asistanı

> **React Native + Node.js tabanlı duygusal günlük asistanı**
>
> Kullanıcı yazdığı duygu cümlesini yapay zekaya göndermeden; tamamen kendi geliştirdiğimiz backend algoritması ile analiz eder, duyguyu sınıflandırır, özetler ve öneri sunar.

---

### 💡 Projenin Amacı

Bu proje, mobil uygulama geliştirme ve basit yapay zeka algoritmalarının gerçek hayatta nasıl uygulanabileceğini göstermek amacıyla geliştirilmiştir.

Kullanıcıların gün içinde hissettikleri duygu ve düşünceleri yazarak:

- Duygu analizi alma
- Duygunun yoğunluğunu görme
- Kısa özet okuma
- Günlük öneriler alma
- Geçmiş analizlerini görebilme

özelliklerini sunar.

---

### 🛠️ Kullanılan Teknolojiler

| Alan         | Teknoloji                 |
| ------------ | ------------------------- |
| Mobil        | React Native (TypeScript) |
| Backend      | Node.js + Express.js      |
| Veri Saklama | AsyncStorage              |
| Tasarım      | React Native StyleSheet   |
| Bağlantı     | REST API                  |
| Emülatör     | Android Studio            |

---

### 🔐 Öne Çıkan Özellikler

✔ _AI servisi kullanım gerektirmez_ (token yok, ücret yok).  
✔ Sentiment analizi **tamamen bizim yazdığımız kurallarla** çalışır.  
✔ Güçlü pozitif / normal pozitif / karışık / nötr / negatif / çok negatif gibi **yoğunluk bazlı sınıflandırma** yapılır.  
✔ Özet + öneri **otomatik üretilir**.  
✔ **Geçmiş kayıtlar AsyncStorage ile saklanır** (cihaz içinde kalır, gizlilik korunur).

---

### 📱 Uygulama Özellikleri

| Özellik            | Açıklama                                                  |
| ------------------ | --------------------------------------------------------- |
| 🧠 Duygu Analizi   | Kullanıcı cümlesindeki duygu tonunu analiz eder           |
| 🎭 Şiddet Seviyesi | Çok pozitif, pozitif, nötr, karışık, negatif, çok negatif |
| 📌 Özet            | Günün duygusunu kısa ve net tanımlar                      |
| 🎁 Öneri           | Kullanıcıya uygun küçük tavsiyeler sunar                  |
| 📂 Geçmiş          | Kullanıcının önceki duygu değerlendirmelerini listeler    |
| 🎨 Arayüz          | Duygu durumuna göre ekran arka planı otomatik değişir     |

---

### 📂 Proje Yapısı

Ai-Gunluk-Asistani
┣ 📱 mobile (React Native)
┣ 🌐 api (Node.js Backend)
┗ 📄 README.md

---

### 🚀 Kurulum

#### 📌 Backend Çalıştırma (API)

cd api
npm install
node server.js

#### 📱 Mobil Uygulama Çalıştırma

cd mobile
npm install
npm start

Ardından Android için:

npx react-native run-android

⚠️ Android emulator için backend bağlantısı şu IP üzerinden yapılır:

http://10.0.2.2:3000/analyze

---

### 🗄️ Geçmiş Verilerin Saklanması

Uygulamadaki analiz sonuçları tarayıcı veya sunucuda değil, **cihaz içinde saklanır.**
Kullanıcı gizliliği korunur.  
🗃️ `AsyncStorage` kullanılmıştır.

---

### 📸 Ekran Görüntüleri

📌 Buraya uygulama ekran görüntüleri eklenecektir

> Ekran görüntülerini göndermek istersen ekleyebilirim.

---

### 👨‍💻 Geliştirici Notu

Bu proje, React Native ve Node.js’e yeni başlayan biri olarak **aktif şekilde araştırarak**, dökümantasyon inceleyerek ve mentorluk desteği alarak geliştirilmiştir.

> Yapay zeka desteği proje sırasında yalnızca yönlendirme amacıyla kullanılmış,
> kodlar öğrenilerek ve anlaşılır şekilde manuel olarak uygulanmıştır.

---

### 🎯 Son Söz

Bu proje sayesinde hem mobil geliştirme sürecini hem de basit AI algoritmalarının nasıl üretilebileceğini deneyimledim.  
**Staj programınıza kabul edilmesem bile**, böyle bir proje verip öğrenme fırsatı sunduğunuz için teşekkür ederim.  
Projeyi geliştirmek benim için hem öğretici hem de keyifli bir süreç oldu. 🙌

---

### 📌 Lisans

Bu proje eğitim amacıyla geliştirilmiştir. İzin verilmeden ticari amaçla kullanılamaz.

---
