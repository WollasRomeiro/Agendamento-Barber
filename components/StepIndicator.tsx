import React from 'react';

interface Step {
  id: string;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void; 
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <nav aria-label="Progress" className="mb-10">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-3 sm:pr-8' : ''}`}>
            {stepIdx < currentStepIndex ? (
              // Completed step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-orange-600" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 cursor-default"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                 <div className="absolute top-9 text-center w-full pr-3 sm:pr-8 -ml-1/2">
                    <span className="text-xs font-medium text-neutral-400">{step.name}</span>
                </div>
              </>
            ) : stepIdx === currentStepIndex ? (
              // Current step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-neutral-700" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-600 bg-neutral-900"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-600" aria-hidden="true" />
                </div>
                <div className="absolute top-9 text-center w-full pr-3 sm:pr-8 -ml-1/2">
                    <span className="text-xs font-semibold text-orange-500">{step.name}</span>
                </div>
              </>
            ) : (
              // Upcoming step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-neutral-700" />
                </div>
                <div
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-900 cursor-default"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700 " aria-hidden="true" />
                </div>
                 <div className="absolute top-9 text-center w-full pr-3 sm:pr-8 -ml-1/2">
                    <span className="text-xs font-medium text-neutral-500">{step.name}</span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};