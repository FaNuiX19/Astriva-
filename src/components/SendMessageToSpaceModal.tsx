import React, { useState, useEffect } from 'react';
import {
  Radio,
  X,
  Satellite,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { getLocalizedExplorers } from '../data/explorersUr';
import { soundFX, speechNarrator } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface SendMessageToSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExplorerId?: string;
}

interface TransmittedMessage {
  id: string;
  targetName: string;
  senderName: string;
  messageText: string;
  replyText: string;
  distanceKm: number;
  lightTravelTimeSec: number;
  frequency: string;
  timestamp: string;
}

export const SendMessageToSpaceModal: React.FC<SendMessageToSpaceModalProps> = ({
  isOpen,
  onClose,
  defaultExplorerId,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const translations = getTranslations(language);
  const t = translations.sendModal;
  const dispatchT = translations.dispatch;
  const explorers = getLocalizedExplorers(language);

  const [selectedExplorerId, setSelectedExplorerId] = useState<string>(
    defaultExplorerId || 'apollo12-alsep'
  );
  const [senderName, setSenderName] = useState(t.defaultSender);
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionPhase, setTransmissionPhase] = useState<'idle' | 'beaming' | 'received'>('idle');
  const [latestReply, setLatestReply] = useState<TransmittedMessage | null>(null);
  const [history, setHistory] = useState<TransmittedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync default sender name when language changes if still at default
  useEffect(() => {
    const enDefault = getTranslations('en').sendModal.defaultSender;
    const urDefault = getTranslations('ur').sendModal.defaultSender;
    if (senderName === enDefault || senderName === urDefault || !senderName.trim()) {
      setSenderName(t.defaultSender);
    }
  }, [language, t.defaultSender, senderName]);

  const selectedExplorer =
    explorers.find((e) => e.id === selectedExplorerId) || explorers[0];
  const isMoon = selectedExplorer.destination === 'The Moon';
  const isKepler = selectedExplorer.id === 'kepler';
  const distanceKm = isMoon ? 384400 : isKepler ? 151000000 : 225000000;
  const lightTravelTimeSec = isMoon ? 1.28 : isKepler ? 504 : 750;
  const lightTimeFormatted = isMoon
    ? dispatchT.travelTimes.moon
    : isKepler
    ? dispatchT.travelTimes.kepler
    : dispatchT.travelTimes.mars;

  const handleBeamMessage = async () => {
    if (!message.trim() || isTransmitting) return;

    soundFX.playTransmissionBeep();
    setIsTransmitting(true);
    setTransmissionPhase('beaming');
    speechNarrator.stop();
    setIsSpeaking(false);

    try {
      const res = await fetch('/api/send-message-to-space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetExplorerId: selectedExplorer.id,
          explorerName: selectedExplorer.name,
          message: message.trim(),
          senderName: senderName.trim(),
          language,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        soundFX.playIncomingTransmission();
        const newTrans: TransmittedMessage = {
          id: `tx-${Date.now()}`,
          targetName: selectedExplorer.name,
          senderName: senderName.trim() || t.defaultSender,
          messageText: message.trim(),
          replyText: data.reply || t.defaultReply,
          distanceKm: data.distanceKm || distanceKm,
          lightTravelTimeSec: data.lightTravelTimeSec || lightTravelTimeSec,
          frequency: data.frequency || 'X-Band 8.4 GHz (DSN Goldstone)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setLatestReply(newTrans);
        setHistory((prev) => [newTrans, ...prev]);
        setTransmissionPhase('received');
        setIsTransmitting(false);
      }, 1600);
    } catch (err) {
      console.error('Failed to send message to space:', err);
      setTimeout(() => {
        soundFX.playIncomingTransmission();
        const destLabel = selectedExplorer.displayDestination || selectedExplorer.destination;
        const fallbackTrans: TransmittedMessage = {
          id: `tx-${Date.now()}`,
          targetName: selectedExplorer.name,
          senderName: senderName.trim() || t.defaultSender,
          messageText: message.trim(),
          replyText: isUrdu
            ? `ٹیلی میٹری منسلک! سلام ${senderName || t.defaultSender}! ${destLabel} سے آپ کا پیغام صاف موصول ہوا۔ ایسٹریوا کے کھوجیوں کو یاد رکھنے کا شکریہ! — ${selectedExplorer.name}`
            : `Telemetry locked! Hello ${senderName}! Receiving your signal loud and clear from ${destLabel}. Thank you for remembering the Astriva explorers! — ${selectedExplorer.name}`,
          distanceKm,
          lightTravelTimeSec,
          frequency: 'X-Band 8.4 GHz (DSN 70m Antenna)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setLatestReply(fallbackTrans);
        setHistory((prev) => [fallbackTrans, ...prev]);
        setTransmissionPhase('received');
        setIsTransmitting(false);
      }, 1600);
    }
  };

  const handleSpeakReply = (text: string) => {
    if (isSpeaking) {
      speechNarrator.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechNarrator.speak(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false),
        language
      );
    }
  };

  const resetForm = () => {
    setMessage('');
    setTransmissionPhase('idle');
    setLatestReply(null);
    speechNarrator.stop();
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none animate-[fadeIn_0.2s_ease-out]">
      <div
        dir={dir}
        className={`relative w-full max-w-2xl rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] text-[#F5F8FF] shadow-[0_25px_65px_rgba(0,0,0,0.95)] flex flex-col h-[650px] max-h-[92vh] overflow-hidden ${
          isUrdu ? 'font-urdu text-right' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#E7B96A]/30 bg-gradient-to-r from-[#102C57] via-[#0A1F3F] to-[#102C57]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#102C57] border border-[#E7B96A] flex items-center justify-center shadow-[0_0_15px_rgba(231,185,106,0.3)] shrink-0">
              <Radio className="w-5 h-5 text-[#00E5FF] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-sm sm:text-base font-bold text-[#E7B96A] ${
                    isUrdu ? 'font-urdu' : 'font-cinzel'
                  }`}
                >
                  {t.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-semibold border border-[#00E5FF]/30">
                  {t.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#F2E6CB]/75">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              speechNarrator.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#F2E6CB]/70 hover:text-[#FFF1C5] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* DSN Telemetry Banner */}
          <div className="p-3 rounded-xl bg-[#102C57]/70 border border-[#E7B96A]/30 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
            <div>
              <span className="text-[#E7B96A]/80 font-semibold block uppercase text-[10px]">
                {t.targetDestination}
              </span>
              <span className="font-bold text-[#F5F8FF]">
                {selectedExplorer.name} ({selectedExplorer.displayDestination || selectedExplorer.destination})
              </span>
            </div>
            <div>
              <span className="text-[#E7B96A]/80 font-semibold block uppercase text-[10px]">
                {t.signalDistance}
              </span>
              <span dir="ltr" className="font-mono text-[#00E5FF] font-bold">
                ~{distanceKm.toLocaleString()} km
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#E7B96A]/80 font-semibold block uppercase text-[10px]">
                {t.lightTravelTime}
              </span>
              <span className="font-mono text-[#E7B96A] font-bold">
                {lightTimeFormatted}
              </span>
            </div>
          </div>

          {/* View 1: Composer & Target Selection */}
          {transmissionPhase === 'idle' && (
            <div className="space-y-4">
              {/* Target Explorer Picker */}
              <div>
                <label className="text-xs font-bold text-[#E7B96A] tracking-wider uppercase block mb-1.5">
                  {t.chooseRecipient}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {explorers.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => {
                        soundFX.playMarkerClick();
                        setSelectedExplorerId(exp.id);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isUrdu ? 'text-right' : 'text-left'
                      } ${
                        selectedExplorerId === exp.id
                          ? 'bg-[#1E3A8A] border-[#E7B96A] shadow-md ring-1 ring-[#E7B96A]'
                          : 'bg-[#102C57]/40 border-white/10 hover:border-[#E7B96A]/40'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#F5F8FF] truncate">{exp.name}</div>
                      <div className="text-[10px] text-[#F2E6CB]/60">
                        {exp.displayDestination || exp.destination}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Callsign */}
              <div>
                <label className="text-xs font-bold text-[#E7B96A] tracking-wider uppercase block mb-1">
                  {t.yourCallsign}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={t.callsignPlaceholder}
                  className="w-full bg-[#102C57]/60 border border-[#E7B96A]/40 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] focus:border-[#E7B96A] focus:outline-none"
                />
              </div>

              {/* Message Composer */}
              <div>
                <label className="text-xs font-bold text-[#E7B96A] tracking-wider uppercase block mb-1">
                  {t.yourTransmission}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  className="w-full bg-[#102C57]/60 border border-[#E7B96A]/40 rounded-xl p-3 text-xs text-[#F5F8FF] focus:border-[#E7B96A] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Quick Preset Ideas */}
              <div>
                <span className="text-[10px] text-[#E7B96A] font-bold uppercase tracking-wider block mb-1.5">
                  {t.pickTemplate}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {t.presetMessages.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        soundFX.playMarkerClick();
                        setMessage(msg);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-full bg-[#102C57]/50 hover:bg-[#1E3A8A] text-[#F2E6CB]/90 border border-white/10 hover:border-[#E7B96A]/50 transition-colors cursor-pointer ${
                        isUrdu ? 'text-right' : 'text-left'
                      }`}
                    >
                      &ldquo;{msg.substring(0, 36)}...&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Beam Button */}
              <button
                type="button"
                onClick={handleBeamMessage}
                disabled={!message.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#CA8A04] via-[#E7B96A] to-[#CA8A04] text-[#06132D] font-extrabold text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(231,185,106,0.4)] hover:shadow-[0_0_30px_rgba(231,185,106,0.7)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
              >
                <Radio className="w-4 h-4" />
                <span>{t.beamButton(selectedExplorer.name)}</span>
                <Zap className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* View 2: Beaming Animation */}
          {transmissionPhase === 'beaming' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF] animate-ping opacity-40" />
                <div className="absolute inset-2 rounded-full border border-[#E7B96A] animate-[spin_4s_linear_infinite]" />
                <Satellite className="w-12 h-12 text-[#00E5FF] animate-bounce" />
              </div>

              <div className="space-y-1">
                <h4
                  className={`text-base font-bold text-[#E7B96A] ${
                    isUrdu ? 'font-urdu' : 'font-cinzel'
                  }`}
                >
                  {t.beamingTitle}
                </h4>
                <p className="text-xs text-[#93C5FD]">{t.beamingSubtitle}</p>
                <div className="font-mono text-[11px] text-[#00E5FF] pt-2">
                  {t.carrierInfo(selectedExplorer.name)}
                </div>
              </div>
            </div>
          )}

          {/* View 3: Received Reply */}
          {transmissionPhase === 'received' && latestReply && (
            <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#102C57] to-[#0A1F3F] border-2 border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.25)] space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                    <span className="font-bold text-xs text-[#00E5FF] uppercase tracking-wider">
                      {t.replyDownlinked}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#F2E6CB]/60 font-mono">
                    {latestReply.timestamp}
                  </span>
                </div>

                <div className="text-xs text-[#F2E6CB]/75 italic bg-[#06132D]/60 p-2.5 rounded-lg border border-white/5">
                  <span className="font-semibold text-[#E7B96A] not-italic block mb-0.5">
                    {t.yourMessage}
                  </span>
                  &ldquo;{latestReply.messageText}&rdquo;
                </div>

                <div className="text-xs sm:text-sm text-[#F5F8FF] font-storybook leading-relaxed bg-[#102C57]/80 p-3.5 rounded-xl border border-[#E7B96A]/40 shadow-inner">
                  <span
                    className={`font-bold text-[#E7B96A] block mb-1 ${
                      isUrdu ? 'font-urdu' : 'font-cinzel'
                    }`}
                  >
                    {t.responds(latestReply.targetName)}
                  </span>
                  &ldquo;{latestReply.replyText}&rdquo;
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleSpeakReply(latestReply.replyText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102C57] hover:bg-[#1E3A8A] text-[#E7B96A] text-xs font-semibold border border-[#E7B96A]/40 transition-colors cursor-pointer"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span>{t.stopVoice}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span>{t.playTransmission}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E7B96A] text-[#06132D] text-xs font-bold tracking-wider uppercase hover:bg-[#FFF1C5] transition-colors cursor-pointer"
                  >
                    <span>{t.sendAnother}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Previous Transmissions History Log */}
          {history.length > 1 && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-[#E7B96A] tracking-wider uppercase block">
                {t.sessionLog(history.length)}
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {history.slice(1).map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 rounded-xl bg-[#0A1F3F]/60 border border-white/5 text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[#E7B96A] font-semibold">
                      <span>{t.toLabel(h.targetName)}</span>
                      <span className="text-[10px] text-white/40">{h.timestamp}</span>
                    </div>
                    <p className="text-white/80 line-clamp-1 italic">&ldquo;{h.messageText}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
