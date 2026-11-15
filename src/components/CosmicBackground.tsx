import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#030712]">
      <img
        src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.06.44_AM_bdb25a93.jpeg"
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

