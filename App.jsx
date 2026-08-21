import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Download,
  User,
  Sparkles,
  TrendingUp,
  Target,
  ChevronDown,
  Volume2,
  ChevronRight,
  RefreshCw,
  BarChart2,
  CheckCircle2,
  Flame,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const QUESTIONS = [
  "Hello! Welcome to your AI Speaking Exam. Could you please introduce yourself and describe your typical daily routine?",
  "That sounds interesting! Now tell me about a memorable trip or journey you have taken recently. What made it special?",
  "If you could change one thing about how languages are taught in schools today, what would it be and why?",
];

const CRITERIA = [
  { title: "Fluency", icon: "🗣️" },
  { title: "Vocabulary", icon: "📚" },
  { title: "Grammar", icon: "✍️" },
  { title: "Pronunciation", icon: "🔊" },
  { title: "Coherence", icon: "🧠" },
  { title: "Interaction", icon: "💬" },
];

const Header = ({ studentLevel, setStudentLevel }) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-indigo-900/50 backdrop-blur-md" style={{ backgroundColor: 'rgba(30, 24, 68, 0.85)' }}>
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl shadow-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(75,59,219), rgb(238,59,137))' }}>
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-wide text-white">SpeakAI Examiner</h1>
          <p className="text-xs text-indigo-300/80">Adaptive English Speaking Assessment</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold border transition"
            style={{ color: 'rgb(249, 182, 53)', borderColor: 'rgba(249, 182, 53, 0.4)', backgroundColor: 'rgba(249, 182, 53, 0.1)' }}
          >
            <span>Target: {studentLevel}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-xl border overflow-hidden z-50" style={{ background: 'rgb(24, 20, 50)', borderColor: 'rgba(255,255,255,0.1)' }}>
              {['A2', 'B1', 'B2', 'C1'].map((lv) => (
                <button
                  key={lv}
                  onClick={() => { setStudentLevel(lv); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${studentLevel === lv ? 'font-bold' : 'text-slate-300'}`}
                  style={{ color: studentLevel === lv ? 'rgb(238, 59, 137)' : 'rgb(215, 215, 248)' }}
                >
                  {lv}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pl-3 border-l border-indigo-800/60">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md" style={{ backgroundColor: 'rgb(215, 215, 248)', color: 'rgb(51, 41, 140)' }}>
            АД
          </div>
          <span className="text-sm font-medium hidden sm:inline text-slate-200">Alexander</span>
        </div>
      </div>
    </header>
  );
};

const AnimatedOrb = () => (
  <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
    <div className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse" style={{ backgroundColor: 'rgb(238, 59, 137)' }} />
    <div className="w-20 h-20 rounded-full border-2 border-pink-400/50 flex items-center justify-center relative z-10 shadow-inner animate-bounce" style={{ background: 'radial-gradient(circle, rgb(75, 59, 219) 0%, rgb(51, 41, 140) 100%)' }}>
      <Sparkles className="w-8 h-8 text-pink-300" />
    </div>
  </div>
);

const MicVisualizer = ({ isActive }) => {
  const [heights, setHeights] = useState(() => Array.from({ length: 16 }, () => 6));

  useEffect(() => {
    if (!isActive) {
      setHeights(Array.from({ length: 16 }, () => 6));
      return;
    }
    const id = setInterval(() => {
      setHeights((prev) => prev.map(() => Math.floor(Math.random() * 24) + 6));
    }, 120);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full transition-all duration-100"
          style={{ height: `${h}px`, backgroundColor: isActive ? 'rgb(238, 59, 137)' : 'rgb(75, 59, 219)' }}
        />
      ))}
    </div>
  );
};

const WelcomeScreen = ({ onStart }) => (
  <div className="space-y-8">
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider border" style={{ color: 'rgb(238, 59, 137)', borderColor: 'rgba(238, 59, 137, 0.4)', background: 'rgba(238, 59, 137, 0.1)' }}>
        <Flame className="w-4 h-4" />
        <span>AI-POWERED SPEAKING TEST</span>
      </div>
      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
        Can AI Become Your Personal <span style={{ color: 'rgb(238, 59, 137)' }}>Speaking Examiner</span>?
      </h2>
      <p className="text-indigo-200/80 text-sm sm:text-base leading-relaxed">
        Experience an adaptive interactive English conversation. Get instant objective evaluation across 6 critical IELTS-standard speech metrics.
      </p>
    </div>

    <div className="p-8 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center max-w-xl mx-auto" style={{ background: 'linear-gradient(180deg, rgba(51, 41, 140, 0.6) 0%, rgba(30, 24, 68, 0.8) 100%)' }}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, rgb(75,59,219), rgb(238,59,137), rgb(249,182,53))' }} />
      <AnimatedOrb />
      <h3 className="text-lg font-semibold text-white mb-2">Ready for your practice session?</h3>
      <p className="text-xs text-indigo-300 mb-6 max-w-sm mx-auto">The test takes about 3 minutes. Make sure your microphone is working and speak naturally.</p>
      <button
        onClick={onStart}
        className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white shadow-xl hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 mx-auto"
        style={{ background: 'linear-gradient(135deg, rgb(75,59,219) 0%, rgb(238,59,137) 100%)' }}
      >
        <span>Start Speaking Exam</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
      {CRITERIA.map((item, idx) => (
        <div key={idx} className="p-4 rounded-2xl border border-indigo-800/40 backdrop-blur-md flex items-start space-x-3" style={{ backgroundColor: 'rgba(51, 41, 140, 0.25)' }}>
          <span className="text-2xl">{item.icon}</span>
          <div>
            <h4 className="font-semibold text-sm text-white">{item.title}</h4>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExamScreen = ({ isRecording, toggleRecording, nextQuestion, currentQuestionIndex, examTime, transcript, formatTime, error }) => {
  const [heights, setHeights] = useState(() => Array.from({ length: 16 }, () => 6));

  useEffect(() => {
    if (!isRecording) {
      setHeights(Array.from({ length: 16 }, () => 6));
      return;
    }
    const id = setInterval(() => {
      setHeights((prev) => prev.map(() => Math.floor(Math.random() * 24) + 6));
    }, 120);
    return () => clearInterval(id);
  }, [isRecording]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl border border-indigo-800/50 flex items-center justify-between" style={{ backgroundColor: 'rgba(51, 41, 140, 0.3)' }}>
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'rgb(238, 59, 137)' }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'rgb(238, 59, 137)' }} />
          </span>
          <span className="text-xs font-semibold tracking-wider text-indigo-200">
            QUESTION {currentQuestionIndex + 1} OF {QUESTIONS.length}
          </span>
        </div>
        <div className="font-mono text-sm font-bold px-3 py-1 rounded-lg border" style={{ color: 'rgb(249, 182, 53)', borderColor: 'rgba(249, 182, 53, 0.2)', backgroundColor: 'rgba(249, 182, 53, 0.1)' }}>
          ⏱️ {formatTime(examTime)}
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(51, 41, 140, 0.7) 0%, rgba(20, 16, 45, 0.9) 100%)' }}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center relative" style={{ background: 'radial-gradient(circle, rgb(75, 59, 219), rgb(51, 41, 140))' }}>
          <Volume2 className={`w-8 h-8 ${isRecording ? 'text-pink-400 animate-pulse' : 'text-indigo-300'}`} />
        </div>

        <div className="min-h-[60px] flex items-center justify-center px-4">
          <p className="text-lg sm:text-xl font-medium text-white leading-snug">
            "{QUESTIONS[currentQuestionIndex]}"
          </p>
        </div>

        <div className="flex items-center justify-center space-x-1 h-8 mt-6">
          {heights.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-100"
              style={{ height: `${h}px`, backgroundColor: isRecording ? 'rgb(238, 59, 137)' : 'rgb(75, 59, 219)' }}
            />
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-indigo-900/60 min-h-[110px]" style={{ backgroundColor: 'rgba(15, 12, 35, 0.6)' }}>
        <div className="flex items-center justify-between text-xs text-indigo-400 mb-2">
          <span>YOUR LIVE TRANSCRIPT (STT)</span>
          {isRecording && <span className="text-pink-400 animate-pulse font-semibold">● Recording Audio</span>}
        </div>
        <p className="text-sm text-slate-200 italic leading-relaxed">
          {transcript || "Click microphone below and start speaking your answer..."}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl border border-red-500/40 flex items-center space-x-3" style={{ backgroundColor: 'rgba(239, 68, 88, 0.15)' }}>
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={toggleRecording}
          className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all shadow-lg ${
            isRecording
              ? 'text-white animate-pulse'
              : 'text-white hover:opacity-90'
          }`}
          style={{ backgroundColor: !isRecording ? 'rgb(238, 59, 137)' : 'rgb(239, 68, 88)' }}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isRecording ? 'Stop & Save Answer' : 'Start Recording Speech'}</span>
        </button>

        <button
          onClick={nextQuestion}
          className="py-4 px-6 rounded-2xl font-bold text-white border border-indigo-500/40 hover:bg-indigo-800/40 flex items-center space-x-2"
          style={{ backgroundColor: 'rgba(75, 59, 219, 0.4)' }}
        >
          <span>{currentQuestionIndex < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Test'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ResultsScreen = ({ results, onStart, isLoading }) => {
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-pink-400" />
        <p className="text-indigo-200 text-sm">Analyzing your speech with AI...</p>
      </div>
    );
  }

  if (!results) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(51, 41, 140, 0.9) 0%, rgba(30, 24, 68, 0.9) 100%)' }}>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3" style={{ color: 'rgb(52, 211, 153)', borderColor: 'rgba(52, 211, 153, 0.3)', background: 'rgba(6, 78, 59, 0.4)' }}>
          <CheckCircle2 className="w-4 h-4" />
          <span>EXAM COMPLETED</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
          Assessment Analysis
        </h2>
        <p className="text-xs text-indigo-300">Detailed breakdown based on CEFR Framework</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <div className="px-6 py-4 rounded-2xl border text-center" style={{ borderColor: 'rgba(238, 59, 137, 0.3)', background: 'rgba(238, 59, 137, 0.15)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'rgb(238, 59, 137)' }}>Estimated Level</span>
            <span className="text-3xl font-black text-white">{results.estimated_level}</span>
          </div>

          <div className="px-6 py-4 rounded-2xl border text-center" style={{ borderColor: 'rgba(249, 182, 53, 0.3)', background: 'rgba(249, 182, 53, 0.15)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'rgb(249, 182, 53)' }}>Strongest Skill</span>
            <span className="text-lg font-bold text-white">{results.strongest_skill} ({results.metrics.find(m => m.name.includes('Vocabulary'))?.score || 85}%)</span>
          </div>

          <div className="px-6 py-4 rounded-2xl border text-center" style={{ borderColor: 'rgba(239, 68, 88, 0.3)', background: 'rgba(239, 68, 88, 0.15)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'rgb(239, 68, 88)' }}>Biggest Weakness</span>
            <span className="text-lg font-bold text-white">{results.biggest_weakness} ({results.metrics.find(m => m.name.includes('Fluency'))?.score || 68}%)</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-4" style={{ background: 'linear-gradient(90deg, rgba(249, 182, 53, 0.15) 0%, rgba(51, 41, 140, 0.4) 100%)' }}>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(249, 182, 53, 0.2)', color: 'rgb(249, 182, 53)' }}>
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm" style={{ color: 'rgb(249, 182, 53)' }}>NEXT MISSION: ADAPTIVE PRACTICE</h4>
            <p className="text-xs text-slate-300">{results.next_mission}</p>
          </div>
        </div>
        <button
          onClick={onStart}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-900 transition-colors shrink-0"
          style={{ backgroundColor: 'rgb(249, 182, 53)' }}
        >
          Start Mission
        </button>
      </div>

      <div className="p-6 rounded-3xl border border-indigo-900/50 space-y-4" style={{ backgroundColor: 'rgba(30, 24, 68, 0.5)' }}>
        <h3 className="text-sm font-bold tracking-wider uppercase mb-4 flex items-center space-x-2" style={{ color: 'rgb(215, 215, 248)' }}>
          <BarChart2 className="w-4 h-4" style={{ color: 'rgb(238, 59, 137)' }} />
          <span>Skill Performance Metrics</span>
        </h3>

        {results.metrics.map((metric, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-200">{metric.name}</span>
              <span style={{ color: metric.col || 'rgb(238, 59, 137)' }}>{metric.score}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${metric.score}%`, backgroundColor: metric.col || 'rgb(238, 59, 137)' }}
              />
            </div>
            <p className="text-[11px] text-indigo-300/70">{metric.comment}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl border border-indigo-900/60" style={{ backgroundColor: 'rgba(15, 12, 35, 0.6)' }}>
        <h3 className="text-xs font-semibold text-indigo-400 mb-2">TRANSCRIPT</h3>
        <p className="text-sm text-slate-200 italic leading-relaxed">{results.transcript}</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl border border-indigo-500/40 text-xs font-bold text-indigo-200 hover:bg-indigo-900/40 flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retake Assessment</span>
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-lg hover:opacity-90 flex items-center space-x-2"
          style={{ backgroundColor: 'rgb(75, 59, 219)' }}
        >
          <Download className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save to Research Experiment Dataset'}</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isRecording, setIsRecording] = useState(false);
  const [examTime, setExamTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [studentLevel, setStudentLevel] = useState('B1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setExamTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const uploadAudio = async (audioBlob) => {
    setIsLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('question_text', QUESTIONS[currentQuestionIndex]);
      formData.append('target_level', studentLevel);

      const response = await fetch('/api/evaluate-speech', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      setTranscript(data.transcript || '');
      setCurrentStep('results');
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to connect to evaluation server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setError('Microphone access denied. Please allow microphone permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startExam = () => {
    setCurrentStep('exam');
    setCurrentQuestionIndex(0);
    setExamTime(0);
    setTranscript('');
    setResults(null);
    setError('');
  };

  const nextQuestion = async () => {
    if (isRecording) {
      stopRecording();
    }
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript('');
    } else {
      setCurrentStep('results');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col" style={{ backgroundColor: 'rgb(24, 20, 50)' }}>
      <Header studentLevel={studentLevel} setStudentLevel={setStudentLevel} />
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {currentStep === 'welcome' && <WelcomeScreen onStart={startExam} />}
        {currentStep === 'exam' && (
          <ExamScreen
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            nextQuestion={nextQuestion}
            currentQuestionIndex={currentQuestionIndex}
            examTime={examTime}
            transcript={transcript}
            formatTime={formatTime}
            error={error}
          />
        )}
        {currentStep === 'results' && (
          <ResultsScreen
            results={results}
            onStart={startExam}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
