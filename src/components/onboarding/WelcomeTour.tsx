import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const tourSteps = [
  {
    title: 'Welcome to Business Nexus! 👋',
    description: 'This quick tour will show you the key features to help you connect, collaborate, and close deals.',
  },
  {
    title: 'Schedule Meetings 📅',
    description: 'Use the "Meetings" tab to set your availability and manage meeting requests with investors or entrepreneurs.',
  },
  {
    title: 'Video Calls 🎥',
    description: 'Jump into a face-to-face video call directly from the "Video Call" tab — no extra software needed.',
  },
  {
    title: 'Document Chamber 📁',
    description: 'Upload, review, and sign deal documents securely in the "Document Chamber" — right down to e-signatures.',
  },
  {
    title: 'Payments & Wallet 💳',
    description: 'Track your wallet balance, deposit or withdraw funds, and fund deals directly from the "Payments" section.',
  },
  {
    title: "You're all set! 🚀",
    description: 'Explore the sidebar to discover more features. You can revisit this tour anytime from Help & Support.',
  },
];

const STORAGE_KEY = 'nexus_tour_completed';

export const WelcomeTour: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setVisible(true);
    }
  }, []);

  const closeTour = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const nextStep = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!visible) return null;

  const current = tourSteps[step];
  const isLastStep = step === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        <button
          onClick={closeTour}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-4">
          <Sparkles size={22} className="text-primary-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">{current.title}</h2>
        <p className="text-gray-500 mb-6">{current.description}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={closeTour}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip tour
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};