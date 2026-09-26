import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const steps = [
    "Scan QR",
    "Select the Area",
    "Give Details and Photo",
    "Submit Ticket"
  ];

  // Define the start and end positions for each step's animation
  const directions = [
    { start: { y: -50, x: 0 }, end: { y: 50, x: 0 } },   // Slide down
    { start: { x: 50, y: 0 }, end: { x: -50, y: 0 } },   // Slide left
    { start: { x: -50, y: 0 }, end: { x: 50, y: 0 } },   // Slide right
    { start: { y: 50, x: 0 }, end: { y: -50, x: 0 } }    // Slide up
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete
        });
      }
    });

    steps.forEach((text, index) => {
      const dir = directions[index];

      tl.to(textRef.current, {
        opacity: 0,
        x: dir.start.x,
        y: dir.start.y,
        duration: 0,
        onComplete: () => setStep(index)
      })
      .to(textRef.current, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      })
      .to(textRef.current, {
        opacity: 0,
        x: dir.end.x,
        y: dir.end.y,
        duration: 0.8,
        ease: 'power2.in',
        delay: 0.8 // Hold text on screen for a moment
      });
    });

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <div 
        ref={textRef}
        className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-primary-container text-center px-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] opacity-0"
      >
        {steps[step]}
      </div>
    </div>
  );
}
