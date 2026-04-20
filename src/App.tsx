import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  MessageCircle,
  Home as HomeIcon,
  Send,
  Loader2,
  School,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  BookMarked,
} from 'lucide-react';
// BUG FIX: Removed unused imports (BookOpen, FileText, ChevronRight, ExternalLink, Search)
// BUG FIX: Removed unused RESOURCES / Resource imports
import { askGuru, generateTTS } from './services/gemini';

type Page = 'home' | 'chat';
type Language = 'en' | 'bn';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [language, setLanguage] = useState<Language>('bn');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.1);

  return (
    <div className="min-h-screen bg-paper font-sans text-[#1A1A1A] pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b grid-divider">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-end gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="text-brand mb-1">
              <School size={32} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-display text-3xl font-black leading-none tracking-tight">
                Teacher <span className="font-light text-xl text-brand">Bot</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A] opacity-40 font-bold underline decoration-brand/30">
                NCTB Companion
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavButton
              active={currentPage === 'home'}
              onClick={() => setCurrentPage('home')}
              label={language === 'bn' ? 'হোম' : 'Home'}
            />
            <NavButton
              active={currentPage === 'chat'}
              onClick={() => setCurrentPage('chat')}
              label={language === 'bn' ? 'শিক্ষক বট' : 'Teacher Bot'}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'))}
              className="flex items-center gap-2 px-3 py-1.5 border grid-divider hover:bg-black hover:text-white transition-all rounded-sm text-[10px] font-black uppercase tracking-widest"
              title="Switch Language"
            >
              <Languages size={14} />
              {language === 'en' ? 'বাংলা' : 'English'}
            </button>

            {/* Voice Speed */}
            <div className="flex items-center gap-2 px-2 py-1 border grid-divider rounded-sm">
              <span className="text-[8px] font-black opacity-40 uppercase">Speed</span>
              <select
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="text-[10px] font-black bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="0.8">0.8x</option>
                <option value="1.0">1.0x</option>
                <option value="1.1">1.1x</option>
                <option value="1.2">1.2x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsSoundEnabled((prev) => !prev)}
              className={`p-2 border grid-divider rounded-sm transition-all ${isSoundEnabled ? 'text-brand' : 'text-gray-400'}`}
              title={isSoundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            >
              {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              className="md:hidden p-2 text-brand"
              onClick={() => setCurrentPage(currentPage === 'chat' ? 'home' : 'chat')}
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomePage key="home" language={language} onStartChat={() => setCurrentPage('chat')} />
          )}
          {currentPage === 'chat' && (
            <ChatPage
              key="chat"
              language={language}
              isSoundEnabled={isSoundEnabled}
              voiceSpeed={voiceSpeed}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t grid-divider bg-paper py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">
            Teacher Bot •{' '}
            {language === 'bn' ? 'আপনার একাডেমিক সহকারী' : 'Your Academic Assistant'}
          </div>
          <div className="text-[9px] uppercase tracking-widest font-black opacity-20">
            © {new Date().getFullYear()} Dhaka, Bangladesh
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-paper border-t grid-divider p-3 flex items-center justify-around z-50">
        <MobileNavButton
          active={currentPage === 'home'}
          onClick={() => setCurrentPage('home')}
          icon={<HomeIcon size={20} />}
          label="Home"
        />
        <MobileNavButton
          active={currentPage === 'chat'}
          onClick={() => setCurrentPage('chat')}
          icon={<MessageCircle size={20} />}
          label="Bot"
        />
      </div>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-[11px] uppercase tracking-[0.2em] font-black py-2 transition-all relative
        ${active ? 'text-brand' : 'text-[#1A1A1A] opacity-40 hover:opacity-100'}
      `}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand"
        />
      )}
    </button>
  );
}

function MobileNavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-brand' : 'text-gray-400'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// --- PAGES ---

interface HomePageProps {
  onStartChat: () => void;
  language: 'en' | 'bn';
  key?: string;
}

function HomePage({ onStartChat, language }: HomePageProps) {
  const content = {
    en: {
      innovation: 'Dhaka Innovation',
      titleHeader: 'Teacher Bot',
      titleSub: 'Anytime, Anywhere.',
      description:
        'Your personal academic assistant for the NCTB curriculum. Instant answers, clear explanations.',
      askBtn: 'Ask Bot',
      cardTitle: 'How it works',
      cardDescription:
        'Type your query, get an instant audio-enabled explanation tailored to your grade and board syllabus.',
    },
    bn: {
      innovation: 'ঢাকার উদ্ভাবন',
      titleHeader: 'শিক্ষক বট',
      titleSub: 'যেকোনো সময়, যেকোনো স্থানে।',
      description:
        'NCTB কারিকুলামের জন্য আপনার ব্যক্তিগত একাডেমিক সহকারী। তাত্ক্ষণিক উত্তর এবং পরিষ্কার ব্যাখ্যা।',
      askBtn: 'বটকে জিজ্ঞেস করুন',
      cardTitle: 'এটি কিভাবে কাজ করে',
      cardDescription:
        'আপনার প্রশ্নটি লিখুন, আপনার গ্রেড এবং বোর্ড সিলেবাস অনুযায়ী তাৎক্ষণিক অডিও-সক্ষম উত্তর পান।',
    },
  };

  const t = content[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col md:flex-row min-h-[85vh] border-x grid-divider"
    >
      <div className="md:w-3/5 p-8 md:p-16 border-b md:border-b-0 md:border-r grid-divider flex flex-col justify-center">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 mb-8 block">
          {t.innovation}
        </span>
        <h2 className="text-6xl md:text-8xl font-display font-black leading-[0.85] tracking-tight mb-10 text-balance">
          {t.titleHeader} <br />
          <span className="font-light text-5xl md:text-7xl block mt-2">{t.titleSub}</span>
        </h2>
        <p className="max-w-md text-lg text-[#1A1A1A] opacity-60 font-medium mb-12 leading-relaxed">
          {t.description}
        </p>
        <div className="flex">
          <button
            onClick={onStartChat}
            className="bg-brand text-white px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-black transition-all hover:bg-black shadow-xl"
          >
            {t.askBtn}
          </button>
        </div>
      </div>

      <div className="md:w-2/5 p-8 md:p-16 flex flex-col justify-center bg-[#F0EEE6]">
        <div className="relative">
          <div className="absolute -top-4 -right-4 text-[120px] font-display font-black opacity-[0.03] leading-none select-none">
            !
          </div>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-display text-4xl leading-tight border-l-4 border-brand pl-4">
              {t.cardTitle}
            </h3>
          </div>
          <p className="text-sm opacity-60 leading-relaxed mb-8">{t.cardDescription}</p>
          <div className="space-y-4">
            {[
              {
                id: '01',
                title: language === 'bn' ? 'তাত্ক্ষণিক উত্তর' : 'Instant Answers',
                color: 'bg-brand',
              },
              {
                id: '02',
                title: language === 'bn' ? 'অডিও ফিডব্যাক' : 'Audio Feedback',
                color: 'bg-brand',
              },
              {
                id: '03',
                title: language === 'bn' ? 'NCTB কারিকুলাম' : 'NCTB Curriculum',
                color: 'bg-brand',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b grid-divider pb-3"
              >
                <span className="text-[10px] font-black opacity-30">{item.id}</span>
                <span className="text-[11px] uppercase tracking-widest font-black">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChatPage({
  language,
  isSoundEnabled,
  voiceSpeed,
}: {
  language: 'en' | 'bn';
  isSoundEnabled: boolean;
  voiceSpeed: number;
}) {
  const getInitialMessage = (lang: 'en' | 'bn') =>
    lang === 'en'
      ? 'Hello! I am Teacher Bot. How can I help with your studies today?'
      : 'আসসালামু আলাইকুম! আমি শিক্ষক বট। আজকের পড়ালেখায় তোমাকে কীভাবে সাহায্য করতে পারি?';

  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'model', content: getInitialMessage(language) },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'thinking' | 'speaking' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // BUG FIX: Reset chat message when language changes using a stable helper
  useEffect(() => {
    setMessages([{ role: 'model', content: getInitialMessage(language) }]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // BUG FIX: speak() now returns a Promise that resolves when audio FINISHES playing,
  // so await speak() in handleSendMessage properly waits before displaying the message.
  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (!isSoundEnabled) return;

      const cleanText = text
        .replace(/[*_#`]/gu, '')
        .replace(/\[.*\]\(.*\)/gu, '')
        .replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
          ''
        );

      const audioData = await generateTTS(cleanText, language);
      if (audioData) {
        try {
          initAudio();
          const ctx = audioContextRef.current!;
          const binaryString = atob(audioData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const buffer = ctx.createBuffer(1, bytes.length / 2, 24000);
          const channelData = buffer.getChannelData(0);
          const view = new DataView(bytes.buffer);

          for (let i = 0, j = 0; j < channelData.length; i += 2, j++) {
            channelData[j] = view.getInt16(i, true) / 32768;
          }

          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.playbackRate.value = voiceSpeed;
          source.connect(ctx.destination);

          // BUG FIX: Wrap in Promise so caller can await completion
          return new Promise<void>((resolve) => {
            source.onended = () => resolve();
            source.start(0);
          });
        } catch (err) {
          console.error('TTS playback failed:', err);
        }
      }

      // Native Fallback — also await completion
      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
        utterance.rate = voiceSpeed;
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    },
    [isSoundEnabled, language, voiceSpeed]
  );

  // BUG FIX: Wrapped in useCallback so the speech recognition useEffect
  // always holds a fresh reference without needing messages in its dep array.
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text || isLoading) return;
      initAudio();

      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setIsLoading(true);
      setLoadingStep('thinking');

      // Capture history snapshot at call time
      setMessages((prev) => {
        const history = prev.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

        (async () => {
          try {
            const response = await askGuru(text, language, history);

            if (isSoundEnabled) {
              setLoadingStep('speaking');
              await speak(response);
            }

            setMessages((cur) => [...cur, { role: 'model', content: response }]);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
            setLoadingStep(null);
          }
        })();

        return prev; // no change to state here; async work runs above
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, language, isSoundEnabled, speak]
  );

  // BUG FIX: Add handleSendMessage to dependency array so recognition callback is never stale
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      if (transcript.trim()) {
        handleSendMessage(transcript.trim());
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [language, handleSendMessage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      const text = input.trim();
      setInput('');
      handleSendMessage(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto flex flex-col md:flex-row h-[calc(100vh-160px)] border-x grid-divider"
    >
      <div className="flex-1 flex flex-col p-6 md:p-10 border-b md:border-b-0 md:border-r grid-divider">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-4xl">Classroom</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 border border-black rounded-full">
              Guru: Online
            </span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar mb-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-4 items-start ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black uppercase text-white shadow-sm ${m.role === 'user' ? 'bg-black' : 'bg-brand'}`}
              >
                {m.role === 'user' ? 'You' : 'G'}
              </div>
              <div
                className={`flex flex-col gap-1 max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[9px] uppercase font-black opacity-30">
                  {m.role === 'user' ? 'Student' : 'Shikhbor Guru'} •{' '}
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`
                    px-5 py-4 text-[16px] leading-[1.6]
                    ${m.role === 'user'
                      ? 'bg-white border grid-divider text-[#1A1A1A]'
                      : 'font-display text-xl text-brand'
                    }
                  `}
                >
                  {m.role === 'model' ? (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-display">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 items-start pb-10">
              <div className="w-8 h-8 rounded-full shrink-0 bg-brand flex items-center justify-center overflow-hidden">
                <Loader2 size={14} className="animate-spin text-white" />
              </div>
              <div className="flex flex-col gap-3 w-full max-w-md">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-black opacity-30 tracking-widest">
                    Shikhbor Guru • {loadingStep === 'speaking' ? 'Synthesizing' : 'Thinking'}
                  </span>
                  <span className="font-display text-xl opacity-40">
                    {loadingStep === 'speaking'
                      ? language === 'bn'
                        ? 'ভয়েস জেনারেট হচ্ছে...'
                        : 'Generating audio response...'
                      : language === 'bn'
                      ? 'গুরু চিন্তা করছেন...'
                      : 'Consulting curriculum archives...'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative border border-black/5">
                  <motion.div
                    className="absolute inset-0 bg-brand"
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isListening && (
            <div className="flex items-center gap-2 mb-2 animate-pulse text-brand font-black text-[10px] uppercase tracking-widest pl-2">
              <Mic size={14} /> {language === 'bn' ? 'বাংলা রেকর্ডিং হচ্ছে...' : 'Listening...'}
            </div>
          )}
          <form
            onSubmit={handleFormSubmit}
            className="relative border-4 border-black p-1 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'bn' ? 'গুরুকে জিজ্ঞেস করুন' : 'Ask Guru or use Voice...'}
              className="w-full px-4 py-4 pr-32 focus:outline-none text-lg font-display"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title={language === 'bn' ? 'ভয়েস ইনপুট' : 'Voice Input'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-black text-white px-5 py-3 text-[10px] uppercase tracking-widest font-black disabled:opacity-30 h-10 flex items-center"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/3 flex-col bg-[#F0EEE6] p-8 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 text-brand">
          <BookMarked size={20} />
          <h3 className="font-display text-4xl leading-tight">
            Session
            <br />
            Insights
          </h3>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-6 border grid-divider">
            <p className="font-display text-lg leading-tight uppercase opacity-60">
              Optimizing for your curriculum objectives.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
