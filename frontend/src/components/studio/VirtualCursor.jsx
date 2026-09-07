import React, { useEffect, useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { MousePointer2 } from 'lucide-react';

export const VirtualCursor = () => {
  const { cursorPosition, isCursorVisible, isClicking } = useStudioStore();

  if (!isCursorVisible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-700 ease-out"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        transform: 'translate(-2px, -2px)'
      }}
    >
      {/* Click Ripple Animation */}
      {isClicking && (
        <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-rose-500/40 border-2 border-rose-600 animate-ping" />
      )}

      {/* SVG Mouse Pointer Icon with Glow */}
      <div className="relative">
        <MousePointer2 className="w-6 h-6 text-rose-600 fill-rose-600 drop-shadow-[0_4px_10px_rgba(225,29,72,0.5)] transform -rotate-12" />
      </div>
    </div>
  );
};
