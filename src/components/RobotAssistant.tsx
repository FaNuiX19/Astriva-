import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Volume2, VolumeX, Radio, HelpCircle } from 'lucide-react';
import { soundFX, speechNarrator } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface RobotAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSendMessage: (targetExplorerId?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const RobotAssistant: React.FC<RobotAssistantProps> = ({
  isOpen,
  onClose,
  onOpenSendMessage,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslations(language).robotAssistant;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: t.welcomeText,
      timestamp: t.justNow,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep welcome message updated when language switches
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === 'welcome'
          ? { ...msg, text: t.welcomeText, timestamp: t.justNow }
          : msg
      )
    );
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  }, [t.welcomeText, t.justNow]);

  useEffect(() => {
    if (isOpen) {
      soundFX.playRobotChirp();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      speechNarrator.stop();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isLoading) return;

    soundFX.playMarkerClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: t.now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/robot-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend, language }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || t.fallbackReply,
        timestamp: t.now,
      };
      setMessages((prev) => [...prev, botMsg]);
      soundFX.playRobotChirp();
    } catch (err) {
      console.error('Robot assistant error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: t.fallbackReply,
        timestamp: t.now,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      soundFX.playRobotChirp();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (isSpeaking && speakingMsgId === msgId) {
      speechNarrator.stop();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    } else {
      setIsSpeaking(true);
      setSpeakingMsgId(msgId);
      speechNarrator.speak(
        text,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        },
        () => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        },
        language
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none animate-[fadeIn_0.2s_ease-out]">
      <div
        dir={dir}
        className={`relative w-full max-w-lg rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] text-[#F5F8FF] shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col h-[600px] max-h-[90vh] overflow-hidden ${
          isUrdu ? 'font-urdu text-right' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="A.S.T.R.O. Robot Assistant"
      >
        {/* Header with Animated Mascot */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#E7B96A]/30 bg-gradient-to-r from-[#102C57] to-[#0A1F3F]">
          <div className="flex items-center gap-3">
            {/* Robot Mascot Head */}
            <div className="relative w-10 h-10 rounded-xl bg-[#102C57] border border-[#E7B96A] flex items-center justify-center shadow-[0_0_15px_rgba(231,185,106,0.3)] shrink-0">
              {/* Antenna */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-[#E7B96A]">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00E5FF]" />
              </div>
              {/* Eyes */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#E7B96A]">
                  A.S.T.R.O.
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-semibold border border-[#00E5FF]/30">
                  ASTRIVA BOT
                </span>
              </div>
              <p className="text-[11px] text-[#F2E6CB]/75">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSendMessage();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E7B96A]/20 hover:bg-[#E7B96A]/30 text-[#E7B96A] text-[11px] font-semibold border border-[#E7B96A]/40 transition-colors cursor-pointer"
              title={t.deepSpace}
            >
              <Radio className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>{t.deepSpace}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#F2E6CB]/70 hover:text-[#FFF1C5] hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            const isThisSpeaking = isSpeaking && speakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`relative max-w-[85%] rounded-2xl p-3 sm:p-3.5 leading-relaxed shadow-md ${
                    isBot
                      ? 'bg-[#102C57]/90 text-[#F5F8FF] border border-[#E7B96A]/40 rounded-tl-sm'
                      : 'bg-gradient-to-r from-[#CA8A04] to-[#E7B96A] text-[#06132D] font-medium rounded-tr-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Read Aloud Button for Bot */}
                  {isBot && (
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 gap-3">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                          isThisSpeaking
                            ? 'text-[#00E5FF] animate-pulse'
                            : 'text-[#E7B96A] hover:text-[#FFF1C5]'
                        }`}
                      >
                        {isThisSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>{t.stopAudio}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.readOutLoud}</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-[#F2E6CB]/40">
                        {t.telemetryLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#00E5FF] p-2 bg-[#102C57]/40 rounded-xl border border-[#00E5FF]/20 w-fit">
              <Bot className="w-4 h-4 animate-spin text-[#00E5FF]" />
              <span>{t.loadingText}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Kid-Friendly Questions */}
        <div className="p-2 sm:p-3 border-t border-[#E7B96A]/20 bg-[#0A1F3F]/60">
          <div className="flex items-center gap-1.5 text-[10px] text-[#E7B96A] font-bold uppercase tracking-wider mb-1.5">
            <HelpCircle className="w-3 h-3" />
            <span>{t.suggestedQuestionsLabel}</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {t.presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#102C57]/80 hover:bg-[#1E3A8A] text-[#F2E6CB] hover:text-[#FFF1C5] border border-[#E7B96A]/30 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-[#E7B96A]/30 bg-[#06132D] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            disabled={isLoading}
            className="flex-1 bg-[#102C57]/70 border border-[#E7B96A]/40 focus:border-[#E7B96A] focus:outline-none rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#F5F8FF] placeholder:text-white/40"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-[#102C57] to-[#1E3A8A] border border-[#E7B96A] text-[#E7B96A] hover:text-[#FFF1C5] hover:border-[#FFF1C5] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 font-bold text-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.askButton}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
