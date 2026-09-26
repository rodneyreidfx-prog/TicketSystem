import React, { useState, useEffect } from 'react';
import { TicketForm } from './components/TicketForm';
import { SuccessScreen } from './components/SuccessScreen';
import { ParticleBackground } from './components/ParticleBackground';
import { LoadingScreen } from './components/LoadingScreen';
import type { TicketPayload } from './types';

const INITIAL_PAYLOAD: TicketPayload = {
  zone: '',
  subArea: '',
  issueType: '',
  urgency: 'Needs Attention',
  notes: '',
  supplyDetails: [],
  photoBase64: null
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [payload, setPayload] = useState<TicketPayload>(INITIAL_PAYLOAD);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error("Failed to submit ticket");
      }
    } catch (e) {
      console.error(e);
    }
    
    setStatus('success');
  };

  const handleReset = () => {
    setPayload(INITIAL_PAYLOAD);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-on-surface">
      {/* Reactive Gold Wave Background adapted from HTML */}
      <div className="bg-layer fixed inset-0 bg-background -z-20"></div>
      <div className="gold-wave-bg"></div>
      <ParticleBackground />
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      {/* App Bar / Header */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-outline-variant bg-surface/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Gold's Gym <span className="text-primary-container">Lee Hwy</span></h1>
        </div>
        <div className="flex gap-4 items-center">
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Station ID: LEEHWY-01</span>
          <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest text-right">
            {time.toLocaleDateString()} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {status === 'idle' || status === 'submitting' ? (
          <TicketForm 
            payload={payload} 
            setPayload={setPayload} 
            onSubmit={handleSubmit}
            isSubmitting={status === 'submitting'}
          />
        ) : (
          <SuccessScreen onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
