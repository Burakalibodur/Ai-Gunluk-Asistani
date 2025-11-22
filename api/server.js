const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Kategori belirleme: tablo mantığı
function getEmotionCategory(sentiment, score) {
  if (sentiment === "POSITIVE" && score >= 2) {
    return "ÇOK Pozitif 🤩";
  }
  if (sentiment === "POSITIVE" && score < 2) {
    return "Pozitif 😊";
  }
  if (sentiment === "MIXED") {
    return "Karışık 🙂";
  }
  if (sentiment === "NEGATIVE" && score <= -2) {
    return "ÇOK Negatif 😭";
  }
  if (sentiment === "NEGATIVE" && score > -2) {
    return "Negatif 🙁";
  }
  return "Nötr 😐";
}

// Güçlendirilmiş ama sade duygu analizi
app.post("/analyze", (req, res) => {
  try {
    const text = (req.body.text || "").toLowerCase();
    if (!text) {
      return res.status(400).json({ error: "Metin boş olamaz" });
    }

    let score = 0;
    let positiveScore = 0;
    let negativeScore = 0;

    const strongPositives = [
      "harika",
      "müthiş",
      "şahane",
      "mükemmel",
      "süper",
      "efsane",
      "bayıldım",
      "harikaydı",
      "çok iyi",
      "aşırı iyi",
      "harikulade",
      "inanılmaz",
      "muhteşem",
      "fevkalade",
    ];

    const positives = [
      "iyi",
      "mutlu",
      "güzel",
      "sevindim",
      "rahat",
      "huzurlu",
      "keyifli",
      "pozitif",
      "enerjik",
      "başardım",
      "başarı",
      "başarılı",
    ];

    const strongNegatives = [
      "berbat",
      "rezalet",
      "felaket",
      "dayanılmaz",
      "iğrenç",
      "çok kötü",
      "aşırı kötü",
      "nefret",
      "acılı",
      "rezil",
    ];

    const negatives = [
      "kötü",
      "üzgün",
      "yorgun",
      "kırgın",
      "kızgın",
      "sinirli",
      "stresli",
      "bıkkın",
      "kaygılı",
      "moralim bozuk",
      "canım sıkkın",
      "sıkıldım",
      "negatif",
      "bunaldım",
      "tükenmiş",
    ];

    // Güçlü pozitifler
    strongPositives.forEach((w) => {
      if (text.includes(w)) {
        score += 2;
        positiveScore += 2;
      }
    });

    // Normal pozitifler
    positives.forEach((w) => {
      if (text.includes(w)) {
        score += 1;
        positiveScore += 1;
      }
    });

    // Güçlü negatifler
    strongNegatives.forEach((w) => {
      if (text.includes(w)) {
        score -= 2;
        negativeScore -= 2;
      }
    });

    // Normal negatifler
    negatives.forEach((w) => {
      if (text.includes(w)) {
        score -= 1;
        negativeScore -= 1;
      }
    });

    const hasPositive = positiveScore > 0;
    const hasNegative = negativeScore < 0;

    // "çok", "aşırı" gibi yoğunlaştırıcılar
    const intensifiers = ["çok", "cok", "aşırı", "asiri"];
    intensifiers.forEach((w) => {
      if (text.includes(w) && score !== 0) {
        if (score > 0) score += 1;
        else score -= 1;
      }
    });

    // Skoru sınırla (-5, 5)
    if (score > 5) score = 5;
    if (score < -5) score = -5;

    let sentiment = "NEUTRAL";

    if (hasPositive && hasNegative) {
      sentiment = "MIXED";
    } else if (score > 0) {
      sentiment = "POSITIVE";
    } else if (score < 0) {
      sentiment = "NEGATIVE";
    } else {
      sentiment = "NEUTRAL";
    }

    const intensity = Math.abs(score);

    let summary;
    let suggestion;

    if (sentiment === "POSITIVE") {
      if (intensity >= 4) {
        summary = "Bugün gerçekten çok güçlü bir olumlu duygu içindesin.";
        suggestion =
          "Bu motivasyonunu değerlendir: hedeflerin için somut adımlar atabilir veya sevdiğin insanlarla bu enerjiyi paylaşabilirsin.";
      } else if (intensity >= 2) {
        summary = "Genel olarak olumlu ve iyi hissediyorsun.";
        suggestion =
          "Bu pozitif hali korumak için sevdiğin bir aktivite yapabilir veya ufak bir ödülle kendini mutlu edebilirsin.";
      } else {
        summary = "Hafif olumlu bir ruh halin var.";
        suggestion =
          "Günü daha da güzelleştirmek için kısa bir yürüyüş, kahve molası veya sevdiğin bir şey izlemek iyi gelebilir.";
      }
    } else if (sentiment === "NEGATIVE") {
      if (intensity >= 4) {
        summary =
          "Oldukça yoğun ve zorlayıcı olumsuz duygular yaşıyor olabilirsin.";
        suggestion =
          "Kendine karşı nazik ol; mümkünse kısa da olsa mola ver, güvendiğin biriyle konuşmayı veya profesyonel destek almayı düşünebilirsin.";
      } else if (intensity >= 2) {
        summary = "Biraz zorlayıcı ve yıpratıcı bir gün geçiriyor olabilirsin.";
        suggestion =
          "Kısa bir nefes egzersizi, hafif bir yürüyüş veya sevdiğin bir müzik dinlemek iyi gelebilir.";
      } else {
        summary = "Hafif bir gerginlik veya yorgunluk hissediyor olabilirsin.";
        suggestion =
          "Bugünü sakin kapatmaya çalışmak, erken uyumak veya ekrandan uzaklaşıp dinlenmek iyi bir fikir olabilir.";
      }
    } else if (sentiment === "MIXED") {
      summary =
        "Aynı anda hem olumlu hem de olumsuz duygular yaşadığın, dalgalı bir ruh hali içindesin.";
      suggestion =
        "Bu karışıklığı anlamak için nelerin iyi geldiğini ve nelerin canını sıktığını ayrı ayrı yazmayı deneyebilirsin. Gerekirse güvendiğin biriyle konuşmak da iyi gelebilir.";
    } else {
      if (intensity === 0) {
        summary = "Duyguların oldukça dengeli veya nötr görünüyor.";
        suggestion =
          "Günü biraz daha detaylandırmak, nelerin iyi gittiğini ve neleri geliştirmek istediğini görmek açısından faydalı olabilir.";
      } else {
        summary =
          "Hem olumlu hem olumsuz duyguların dengede olduğu bir ruh halin var.";
        suggestion =
          "Bu dengeli hali biraz daha netleştirmek için duygularını detaylandırabilir veya günü küçük parçalara bölerek değerlendirebilirsin.";
      }
    }

    const category = getEmotionCategory(sentiment, score);

    return res.json({
      sentiment,
      summary,
      suggestion,
      score,
      category,
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return res.status(500).json({ error: "Sunucu içinde bir hata oluştu." });
  }
});

app.listen(3000, () => {
  console.log("🎉 AI API çalışıyor: http://localhost:3000");
});
