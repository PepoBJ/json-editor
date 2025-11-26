'use client';

import { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="format"]',
    title: '✨ Format',
    description: 'Beautify your JSON with proper indentation',
    position: 'bottom'
  },
  {
    target: '[data-tour="compare"]',
    title: '⚖️ Compare',
    description: 'Compare two JSONs side-by-side with diff highlighting',
    position: 'bottom'
  },
  {
    target: '[data-tour="convert"]',
    title: '🔄 Convert',
    description: 'Export to YAML, XML, CSV, or Spark schemas',
    position: 'bottom'
  },
  {
    target: '[data-tour="view-toggle"]',
    title: '👁️ View Modes',
    description: 'Switch between Editor, Tree, or Split view',
    position: 'right'
  }
];

export function Tour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('json-tool-tour-completed');
    if (!hasSeenTour) {
      setTimeout(() => setIsActive(true), 1500);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (step.position) {
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2;
            break;
          case 'top':
            top = rect.top - 10;
            left = rect.left + rect.width / 2;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 10;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 10;
            break;
        }

        setPosition({ top, left });
        
        // Highlight element
        element.classList.add('tour-highlight');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target);
      if (element) {
        element.classList.remove('tour-highlight');
      }
    };
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    setIsActive(false);
    localStorage.setItem('json-tool-tour-completed', 'true');
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300" />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 animate-in zoom-in-95 duration-300"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: step.position === 'bottom' || step.position === 'top' 
            ? 'translateX(-50%)' 
            : step.position === 'right' 
            ? 'translateY(-50%)' 
            : 'translate(-100%, -50%)'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-80 border-2 border-emerald-500">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              {step.title}
            </h3>
            <button
              onClick={completeTour}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            {step.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {tourSteps.length}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={completeTour}
                className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1"
              >
                {currentStep < tourSteps.length - 1 ? (
                  <>Next <ArrowRight size={12} /></>
                ) : (
                  'Finish'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
