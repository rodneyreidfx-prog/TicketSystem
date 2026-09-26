import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';
import { playSuccessSound } from '../utils/audio';

interface SuccessScreenProps {
  onReset: () => void;
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    playSuccessSound();
    
    const tl = gsap.timeline();
    tl.fromTo(
      '.success-icon',
      { scale: 0, opacity: 0, rotate: -45 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.5)' }
    )
    .fromTo(
      '.success-text',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="success-icon mb-6 relative">
        <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-2xl"></div>
        <CheckCircle2 className="w-24 h-24 text-primary-container relative z-10 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
      </div>
      <h1 className="success-text font-headline text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-on-surface">
        Request <span className="text-primary-container underline decoration-4 underline-offset-8">Sent</span>
      </h1>
      <p className="success-text font-body text-on-surface-variant max-w-sm mb-12 text-sm italic">
        Thank you! Our housekeeping team has been notified and will address the area shortly.
      </p>
      
      <button
        onClick={onReset}
        className="success-text px-8 py-4 rounded-xl font-black uppercase italic tracking-widest text-sm border-2 border-outline-variant bg-surface-container text-on-surface hover:border-primary-container hover:bg-surface-container-high transition-all shadow-lg"
      >
        Report Another Issue
      </button>
    </div>
  );
}
