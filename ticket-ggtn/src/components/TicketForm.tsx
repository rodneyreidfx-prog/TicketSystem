import React, { useRef, useMemo, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Dumbbell, Droplets, Trash2, ShieldAlert, Waves, Wind, Settings, Users, Activity, ThermometerSun, Bike, Wrench, Asterisk, Camera, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import type { Zone, IssueType, Urgency, TicketPayload } from '../types';

interface TicketFormProps {
  payload: TicketPayload;
  setPayload: React.Dispatch<React.SetStateAction<TicketPayload>>;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const ZONES: { id: Zone; icon: React.ReactNode; label: string }[] = [
  { id: "Men's Locker Room", icon: <Users className="w-6 h-6" />, label: "Men's Locker" },
  { id: "Women's Locker Room", icon: <Users className="w-6 h-6" />, label: "Women's Locker" },
  { id: 'Yoga Room (GGX)', icon: <Activity className="w-6 h-6" />, label: 'Yoga (GGX)' },
  { id: 'Cycle Studio', icon: <Bike className="w-6 h-6" />, label: 'Cycle Studio' },
  { id: 'Turf Room', icon: <Activity className="w-6 h-6" />, label: 'Turf Room' },
  { id: 'Pool', icon: <Waves className="w-6 h-6" />, label: 'Pool' },
  { id: 'Sauna', icon: <ThermometerSun className="w-6 h-6" />, label: 'Sauna' },
  { id: 'Free Weights', icon: <Dumbbell className="w-6 h-6" />, label: 'Free Weights' },
  { id: 'Machines', icon: <Settings className="w-6 h-6" />, label: 'Machines' },
  { id: 'Cardio', icon: <Wind className="w-6 h-6" />, label: 'Cardio' },
];

const SUB_AREAS: Record<Zone, string[]> = {
  "Men's Locker Room": ["Toilets", "Showers", "Sinks", "Locker Area", "General Floor", "Paper Towel Dispenser", "Cleaning Spray"],
  "Women's Locker Room": ["Toilets", "Showers", "Sinks", "Locker Area", "General Floor", "Paper Towel Dispenser", "Cleaning Spray"],
  "Yoga Room (GGX)": ["General Floor", "Mirrors", "Yoga Mats", "Paper Towel Dispenser", "Cleaning Spray"],
  "Cycle Studio": ["General Floor", "Bikes", "Mirrors", "Paper Towel Dispenser", "Cleaning Spray"],
  "Turf Room": ["Turf Area", "Sleds/Equipment", "Paper Towel Dispenser", "Cleaning Spray"],
  "Pool": ["Pool Deck", "Showers", "Paper Towel Dispenser", "Cleaning Spray"],
  "Sauna": ["Sauna Benches", "Sauna Floor", "Paper Towel Dispenser", "Cleaning Spray"],
  "Free Weights": ["General Floor", "Dumbbell Rack", "Benches", "Mirrors", "Paper Towel Dispenser", "Cleaning Spray"],
  "Machines": ["General Floor", "Specific Machine", "Paper Towel Dispenser", "Cleaning Spray"],
  "Cardio": ["General Floor", "Treadmills", "Ellipticals", "Stair Climbers", "Paper Towel Dispenser", "Cleaning Spray"],
  "Other": ["General Area", "Paper Towel Dispenser", "Cleaning Spray"]
};

const ALL_ISSUES: { id: IssueType; icon: React.ReactNode; label: string }[] = [
  { id: 'Needs Cleaning', icon: <Droplets className="w-5 h-5" />, label: 'Needs Cleaning' },
  { id: 'Spill', icon: <Droplets className="w-5 h-5" />, label: 'Spill' },
  { id: 'Empty Supplies', icon: <Trash2 className="w-5 h-5" />, label: 'Empty Supplies' },
  { id: 'Out of Order', icon: <Wrench className="w-5 h-5" />, label: 'Out of Order' },
  { id: 'Clogged / Maintenance', icon: <Wrench className="w-5 h-5" />, label: 'Clogged / Maintenance' },
  { id: 'Restock or Empty', icon: <Trash2 className="w-5 h-5" />, label: 'Restock or Empty' },
  { id: 'Not Functioning / Working', icon: <Wrench className="w-5 h-5" />, label: 'Not Functioning / Working' },
  { id: 'Other', icon: <Asterisk className="w-5 h-5" />, label: 'Other' },
];

const URGENCIES: { id: Urgency; label: string; desc: string }[] = [
  { id: 'No Rush', label: 'No Rush', desc: 'Whenever someone is available' },
  { id: 'Needs Attention', label: 'Needs Attention', desc: 'Please fix soon' },
  { id: 'Urgent', label: 'Urgent', desc: 'Immediate hazard or spill' },
];

const SUPPLIES_LIST = ['Toilet Paper', 'Paper Towels', 'Napkins', 'Hand Soap', 'Hand Sanitizer', 'Disinfectant Wipes'];

export function TicketForm({ payload, setPayload, onSubmit, isSubmitting }: TicketFormProps) {
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.step-content',
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, { dependencies: [step], scope: containerRef });

  const nextStep = () => {
    gsap.to('.step-content', { 
      opacity: 0, x: -30, duration: 0.2, 
      onComplete: () => setStep(s => s + 1) 
    });
  };

  const prevStep = () => {
    gsap.to('.step-content', { 
      opacity: 0, x: 30, duration: 0.2, 
      onComplete: () => setStep(s => s - 1) 
    });
  };

  const handleZoneSelect = (e: React.MouseEvent<HTMLButtonElement>, zone: Zone) => {
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => {
      setPayload(p => ({ ...p, zone, subArea: '', issueType: '' }));
      nextStep();
    }, 150);
  };

  const handleSubAreaSelect = (e: React.MouseEvent<HTMLButtonElement>, subArea: string) => {
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => {
      setPayload(p => ({ ...p, subArea }));
      nextStep();
    }, 150);
  };

  const handleIssueSelect = (e: React.MouseEvent<HTMLButtonElement>, issueType: IssueType) => {
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => {
      setPayload(p => ({ ...p, issueType }));
    }, 150);
  };

  const handleSupplyToggle = (supply: string) => {
    setPayload(p => {
      const current = p.supplyDetails || [];
      if (current.includes(supply)) {
        return { ...p, supplyDetails: current.filter(s => s !== supply) };
      }
      return { ...p, supplyDetails: [...current, supply] };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = 1200;

          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setPayload(p => ({ ...p, photoBase64: compressedBase64 }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPayload(p => ({ ...p, photoBase64: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const availableIssues = useMemo(() => {
    if (!payload.zone) return ALL_ISSUES;
    let issues = ALL_ISSUES;

    if (payload.subArea !== 'Toilets' && payload.subArea !== 'Showers' && payload.subArea !== 'Sinks') {
      issues = issues.filter(i => i.id !== 'Clogged / Maintenance');
    }

    if (payload.subArea === 'Cleaning Spray') {
      issues = issues.filter(i => i.id !== 'Out of Order' && i.id !== 'Empty Supplies' && i.id !== 'Not Functioning / Working');
    } else if (payload.subArea === 'Paper Towel Dispenser') {
      issues = issues.filter(i => i.id !== 'Spill' && i.id !== 'Restock or Empty' && i.id !== 'Out of Order');
    } else {
      issues = issues.filter(i => i.id !== 'Restock or Empty' && i.id !== 'Not Functioning / Working');
      const equipmentZones = ['Machines', 'Cardio', 'Cycle Studio', 'Free Weights'];
      if (equipmentZones.includes(payload.zone)) {
        issues = issues.filter(i => i.id !== 'Empty Supplies');
      } else {
        issues = issues.filter(i => i.id !== 'Out of Order');
      }
    }
    
    return issues;
  }, [payload.zone, payload.subArea]);

  return (
    <div ref={containerRef} className="max-w-md mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center text-sm font-bold text-on-surface-variant hover:text-primary-container transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              BACK
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-primary-container shadow-[0_0_10px_rgba(163,230,53,0.5)]' : 'w-2 bg-surface-container-highest'}`} />
            ))}
          </div>
        </div>
        
        <h1 className="font-headline text-2xl md:text-3xl font-black uppercase italic tracking-tight text-on-surface">
          Submit a <span className="text-primary-container">Ticket</span>
        </h1>
      </div>

      <div className="step-content">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black uppercase tracking-widest text-primary-container">Select Area</label>
            <div className="grid grid-cols-2 gap-3">
              {ZONES.map((z) => {
                const active = payload.zone === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={(e) => handleZoneSelect(e, z.id)}
                    className={`h-24 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-200 ${
                      active 
                        ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_20px_rgba(163,230,53,0.3)] scale-[0.98]' 
                        : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary-container'
                    }`}
                  >
                    <div className={`${active ? 'text-on-primary-container' : 'text-on-surface'}`}>{z.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-center px-1">
                      {z.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && payload.zone && (
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black uppercase tracking-widest text-primary-container">Specific Location in {payload.zone}</label>
            <div className="flex flex-col gap-2">
              {SUB_AREAS[payload.zone as Zone]?.map((sub) => {
                const active = payload.subArea === sub;
                return (
                  <button
                    key={sub}
                    onClick={(e) => handleSubAreaSelect(e, sub)}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all duration-200 ${
                      active 
                        ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_20px_rgba(163,230,53,0.3)]' 
                        : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary-container'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-secondary">What's the issue?</label>
              <div className="flex flex-col gap-3">
                {availableIssues.map((i) => {
                  const active = payload.issueType === i.id;
                  return (
                    <button
                      key={i.id}
                      onClick={(e) => handleIssueSelect(e, i.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        active 
                          ? 'bg-secondary/10 border-secondary/30 text-on-surface shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                          : 'bg-surface-container border-outline-variant text-on-surface hover:border-secondary'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-secondary text-white' : 'bg-surface-container-highest text-on-surface'}`}>
                        {i.icon}
                      </div>
                      <span className="text-sm font-bold">{i.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {payload.issueType === 'Empty Supplies' && (
              <div className="flex flex-col gap-4 mt-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary-fixed-dim">Which supplies are needed?</label>
                <div className="flex flex-wrap gap-2">
                  {SUPPLIES_LIST.map((supply) => {
                    const active = payload.supplyDetails?.includes(supply);
                    return (
                      <button
                        key={supply}
                        onClick={() => handleSupplyToggle(supply)}
                        className={`px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-bold ${
                          active 
                            ? 'bg-primary-fixed-dim text-on-primary-container border-primary-fixed-dim shadow-md' 
                            : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary-fixed-dim'
                        }`}
                      >
                        {supply}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <button
              disabled={!payload.issueType || (payload.issueType === 'Empty Supplies' && payload.supplyDetails.length === 0)}
              onClick={nextStep}
              className="mt-4 w-full py-4 bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-black text-xl uppercase tracking-tighter italic rounded-xl shadow-[0_10px_30px_rgba(255,215,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Urgency Level</label>
              <div className="flex flex-col gap-2">
                {URGENCIES.map(u => {
                  const active = payload.urgency === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setPayload(p => ({ ...p, urgency: u.id as Urgency }))}
                      className={`flex flex-col p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        active 
                          ? (u.id === 'Urgent' ? 'bg-error-container border-error-container text-on-error-container shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'bg-surface-container-highest border-surface-container-highest text-on-surface') 
                          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-primary-container'
                      }`}
                    >
                      <span className="font-bold text-sm">{u.label}</span>
                      <span className="text-[10px] mt-1 opacity-80">{u.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Photo Evidence</label>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              
              {!payload.photoBase64 ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-outline-variant bg-surface-container rounded-xl p-6 hover:border-primary-container hover:text-primary-container transition-colors text-on-surface-variant"
                >
                  <Camera className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-wider">Take a Photo</span>
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-primary-container">
                  <img src={payload.photoBase64} alt="Attached" className="w-full h-40 object-cover" />
                  <button 
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur text-on-surface p-2 rounded-full hover:bg-error hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Additional Context</label>
              <textarea
                value={payload.notes}
                onChange={(e) => setPayload(p => ({ ...p, notes: e.target.value }))}
                placeholder="E.g., Spill is spreading, or Treadmill screen is blank..."
                className="bg-surface-container border-2 border-outline-variant rounded-xl p-4 min-h-[100px] text-on-surface text-sm italic focus:border-primary-container focus:outline-none focus:ring-primary-container resize-none placeholder-on-surface-variant/50"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="relative w-full py-5 bg-error hover:bg-error/90 text-white font-black text-xl uppercase tracking-tighter italic rounded-xl shadow-[0_10px_30px_rgba(217,70,239,0.3)] transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Send Request to Team</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
