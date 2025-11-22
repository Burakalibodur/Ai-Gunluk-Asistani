import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

type HistoryItem = {
  id: string;
  text: string;
  summary: string;
  suggestion: string;
  sentiment: Sentiment;
  score: number | null;
  category: string;
  createdAt: string;
};

const HISTORY_KEY = 'aiDiaryHistory';

// Android emülatöründen backend'e bağlanmak için:
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/analyze'
    : 'http://localhost:3000/analyze';

function getCategoryLabel(
  sentiment: Sentiment,
  score: number | null,
  backendCategory?: string | null,
): string {
  if (backendCategory && backendCategory.trim().length > 0) {
    return backendCategory;
  }

  if (sentiment === 'MIXED') {
    return 'Karışık 🙂';
  }

  if (sentiment === 'POSITIVE') {
    if (score !== null && score >= 2) {
      return 'ÇOK Pozitif 🤩';
    }
    return 'Pozitif 😊';
  }

  if (sentiment === 'NEGATIVE') {
    if (score !== null && score <= -2) {
      return 'ÇOK Negatif 😭';
    }
    return 'Negatif 🙁';
  }

  return 'Nötr 😐';
}

function App() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [summary, setSummary] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Uygulama açıldığında geçmişi yükle
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        if (json) {
          const parsed: HistoryItem[] = JSON.parse(json);
          setHistory(parsed);
        }
      } catch (e) {
        console.log('Geçmiş yüklenirken hata:', e);
      }
    };

    loadHistory();
  }, []);

  const saveHistory = async (items: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch (e) {
      console.log('Geçmiş kaydedilirken hata:', e);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Lütfen önce bir şeyler yaz.');
      setSentiment(null);
      setSummary('');
      setSuggestion('');
      setScore(null);
      setCategory(null);
      return;
    }

    setError(null);
    setLoading(true);
    setSentiment(null);
    setSummary('');
    setSuggestion('');
    setScore(null);
    setCategory(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`API hata: ${response.status} - ${txt}`);
      }

      const data = await response.json();

      const s = (data.sentiment || 'NEUTRAL') as Sentiment;
      const scoreValue =
        typeof data.score === 'number' ? (data.score as number) : null;
      const backendCategory =
        typeof data.category === 'string' ? data.category : null;

      const finalCategory = getCategoryLabel(s, scoreValue, backendCategory);

      setSentiment(s);
      setSummary(data.summary || '');
      setSuggestion(data.suggestion || '');
      setScore(scoreValue);
      setCategory(finalCategory);

      // Yeni kaydı oluştur
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text,
        summary: data.summary || '',
        suggestion: data.suggestion || '',
        sentiment: s,
        score: scoreValue,
        category: finalCategory,
        createdAt: new Date().toISOString(),
      };

      const updated = [newItem, ...history].slice(0, 50); // en fazla 50 kayıt tut
      setHistory(updated);
      await saveHistory(updated);
    } catch (e: any) {
      console.log('API error:', e);
      if (e && typeof e.message === 'string') {
        setError(e.message);
      } else {
        setError('AI API ile konuşurken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getEmotionLabel = () => {
    if (category) return category;

    if (!sentiment) return '';

    return getCategoryLabel(sentiment, score);
  };

  const getBackgroundColor = () => {
    const cat = getEmotionLabel();

    switch (cat) {
      case 'ÇOK Pozitif 🤩':
        return '#2E7D32'; // koyu yeşil
      case 'Pozitif 😊':
        return '#C8E6C9'; // açık yeşil
      case 'Karışık 🙂':
        return '#E1BEE7'; // mor
      case 'Nötr 😐':
        return '#FFF9C4'; // sarı
      case 'Negatif 🙁':
        return '#FFCDD2'; // açık kırmızı
      case 'ÇOK Negatif 😭':
        return '#C62828'; // koyu kırmızı
      default:
        return '#E3F2FD'; // varsayılan mavi ton
    }
  };

  const handleToggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>AI Günlük Asistanım</Text>

        <Text style={styles.subtitle}>
          Bugünkü duygularını yaz. Uygulama bu metni kendi yazdığımız AI
          API&apos;sine gönderip duygu analizi yapacak ve sana özet ile küçük
          bir öneri verecek.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Bugün nasılsın, neler hissettin?"
          value={text}
          onChangeText={setText}
          multiline
        />

        <Button
          title={loading ? 'Analiz ediliyor...' : 'Analiz Et'}
          onPress={handleAnalyze}
          disabled={loading}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        {sentiment && !error && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Duygu Analizi:</Text>

            <Text style={styles.resultText}>{getEmotionLabel()}</Text>

            {score !== null && (
              <Text style={styles.scoreText}>
                Duygu skoru: {score} (−5 ile +5 arası)
              </Text>
            )}

            <Text style={styles.resultTitle}>Özet:</Text>
            <Text style={styles.resultText}>{summary}</Text>

            <Text style={styles.resultTitle}>Öneri:</Text>
            <Text style={styles.resultText}>{suggestion}</Text>
          </View>
        )}

        <View style={styles.historyButtonWrapper}>
          <Button
            title={showHistory ? 'Geçmişi Gizle' : 'Geçmişi Göster'}
            onPress={handleToggleHistory}
          />
        </View>

        {showHistory && (
          <View style={styles.historyBox}>
            <Text style={styles.resultTitle}>Geçmiş Analizler</Text>
            {history.length === 0 ? (
              <Text style={styles.historyEmpty}>Henüz kayıt yok.</Text>
            ) : (
              history.map(item => (
                <View key={item.id} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  <Text style={styles.historyCategory}>{item.category}</Text>
                  <Text style={styles.historyText} numberOfLines={2}>
                    {item.text}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'blue',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    backgroundColor: 'white',
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  resultText: {
    fontSize: 15,
    marginTop: 4,
  },
  scoreText: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  error: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
  historyButtonWrapper: {
    marginTop: 16,
  },
  historyBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  historyEmpty: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
  },
  historyItem: {
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  historyDate: {
    fontSize: 12,
    color: '#777',
  },
  historyCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  historyText: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default App;
