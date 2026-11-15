import React from 'react';
import { X, ExternalLink, ShieldCheck, Compass } from 'lucide-react';
import { getLocalizedExplorers } from '../data/explorersUr';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface NasaSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeExplorerId?: string;
}

export const NasaSourcesModal: React.FC<NasaSourcesModalProps> = ({
  isOpen,
  onClose,
  activeExplorerId,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslations(language).sourcesModal;
  const explorers = getLocalizedExplorers(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div
        dir={dir}
        className={`relative w-full max-w-2xl max-h-[88vh] rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] text-[#F5F8FF] shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ${
          isUrdu ? 'font-urdu text-right' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sources-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E7B96A]/30 bg-[#102C57]/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#E7B96A] shrink-0" />
            <div>
              <h3
                id="sources-title"
                className={`text-base sm:text-lg font-bold text-[#E7B96A] ${
                  isUrdu ? 'font-urdu' : 'font-cinzel'
                }`}
              >
                {t.title}
              </h3>
              <p className="text-[11px] text-[#F2E6CB]/75">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F2E6CB]/70 hover:text-[#FFF1C5] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t.closeAria}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#F5F8FF]/90">
          {/* Note on Astriva Concept */}
          <div className="p-3.5 rounded-xl bg-[#102C57]/60 border border-[#E7B96A]/30">
            <div className="flex items-center gap-2 mb-1.5 text-[#E7B96A] font-semibold">
              <Compass className="w-4 h-4" />
              <span>{t.aboutTitle}</span>
            </div>
            <p className="text-xs text-[#F2E6CB]/90 leading-relaxed">
              {t.aboutText}
            </p>
          </div>

          {/* List of Verified Sources per Explorer */}
          <div className="space-y-3">
            <h4
              className={`text-xs tracking-wider text-[#E7B96A] uppercase font-bold ${
                isUrdu ? 'font-urdu' : 'font-cinzel'
              }`}
            >
              {t.archivesTitle}
            </h4>

            {explorers.map((exp) => {
              const isCurrent = exp.id === activeExplorerId;
              return (
                <div
                  key={exp.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#102C57] border-[#E7B96A] shadow-md ring-1 ring-[#E7B96A]'
                      : 'bg-[#0A1F3F]/50 border-white/10 hover:border-[#E7B96A]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#FFF1C5] text-sm">
                          {exp.name}
                        </span>
                        <span className="text-[10px] text-[#E7B96A]/80 uppercase tracking-wider">
                          ({exp.displayDestination || exp.destination})
                        </span>
                      </div>
                      <div className="text-[11px] text-[#93C5FD] mt-0.5">
                        {exp.nasaSource.organization}
                      </div>
                    </div>

                    <a
                      href={exp.nasaSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1E3A8A]/60 hover:bg-[#2563EB] text-[#F5F8FF] text-[11px] font-medium border border-[#E7B96A]/30 hover:border-[#E7B96A] transition-colors shrink-0"
                    >
                      <span>{t.nasaPage}</span>
                      <ExternalLink className="w-3 h-3 text-[#E7B96A]" />
                    </a>
                  </div>

                  <p className="text-xs text-[#F2E6CB]/80 mt-2 leading-relaxed">
                    {exp.nasaSource.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E7B96A]/30 bg-[#0A1F3F] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#E7B96A] text-[#06132D] font-bold text-xs tracking-wider uppercase hover:bg-[#FFF1C5] transition-colors cursor-pointer"
          >
            {t.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};
