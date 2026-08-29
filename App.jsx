import React, { useState, useRef } from 'react';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Выбираем MIME-тип, поддерживаемый мобильным и десктопным Chrome
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // timeslice 100 мс заставляет Android Chrome сбрасывать данные в ondataavailable
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Ошибка доступа к микрофону:', err);
      setError('Не удалось получить доступ к микрофону.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    // Вся логика отправки выполняется СТРОГО внутри события onstop
    mediaRecorderRef.current.onstop = async () => {
      setIsRecording(false);
      setLoading(true);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      // Валидация размера файла на клиенте
      if (audioBlob.size === 0) {
        setError('Запись не удалась: аудиофайл пустой (0 байт).');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      // 3-й параметр ('audio.webm') обязателен для корректного парсинга в formidable!
      formData.append('file', audioBlob, 'audio.webm');

      try {
        const response = await fetch('/api/evaluate-speech', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка при обработке запроса');
        }

        setResult(data);
      } catch (err) {
        console.error('Ошибка отправки:', err);
        setError(err.message || 'Произошла ошибка при отправке');
      } finally {
        setLoading(false);
        // Отключаем треки микрофона после завершения
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }
      }
    };

    mediaRecorderRef.current.stop();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>SpeakAI Examiner</h1>

      <div style={{ marginY: '20px' }}>
        {!isRecording ? (
          <button 
            onClick={startRecording} 
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? 'Анализ аудио...' : 'Начать запись'}
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#e53e3e', color: '#fff', cursor: 'pointer' }}
          >
            Остановить и отправить
          </button>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '20px', color: 'red', fontWeight: 'bold' }}>
          Ошибка: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Результат оценки:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
            }
