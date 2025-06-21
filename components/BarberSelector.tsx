
import React from 'react';
import { Barber } from '../types';
import { Card } from './Card';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarber: Barber | null;
  onSelectBarber: (barber: Barber) => void;
  isCompleted: boolean;
  onEdit: () => void;
  isDisabled?: boolean;
}

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const UserCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-10 h-10 ${className}`}>
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
  </svg>
);


export const BarberSelector: React.FC<BarberSelectorProps> = ({
  barbers,
  selectedBarber,
  onSelectBarber,
  isCompleted,
  onEdit,
  isDisabled = false,
}) => {
  if (isCompleted && selectedBarber) {
    return (
      <Card title="2. Barbeiro Escolhido" onEdit={onEdit} isEditable={!isDisabled} accentBorder={true}>
        <div className="p-4 bg-neutral-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {selectedBarber.avatarUrl ? (
                <img src={selectedBarber.avatarUrl} alt={selectedBarber.name} className="w-10 h-10 rounded-full object-cover bg-neutral-700" />
              ) : (
                <UserCircleIcon className="text-neutral-500" />
              )}
              <h3 className="text-lg font-semibold text-orange-400">{selectedBarber.name}</h3>
            </div>
            <CheckCircleIcon className="text-orange-500 w-6 h-6 flex-shrink-0 ml-3" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="2. Escolha o Barbeiro" className={isDisabled ? 'opacity-60 pointer-events-none' : ''}>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isDisabled ? 'pointer-events-none' : ''}`}>
        {barbers.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          return (
            <button
              key={barber.id}
              onClick={() => !isDisabled && onSelectBarber(barber)}
              className={`
                p-4 border rounded-lg text-left transition-all duration-200 ease-in-out
                flex flex-col items-center justify-center space-y-2
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 
                ${isSelected
                  ? 'bg-orange-600 border-orange-500 text-white ring-2 ring-orange-400 shadow-lg scale-105'
                  : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 focus:ring-orange-500 text-neutral-200'}
                ${isDisabled ? 'cursor-not-allowed' : ''}  
              `}
              aria-pressed={isSelected}
              disabled={isDisabled}
            >
              {barber.avatarUrl ? (
                <img src={barber.avatarUrl} alt={barber.name} className={`w-16 h-16 rounded-full object-cover mb-2 ${isSelected ? 'border-2 border-white/50' : 'border-2 border-neutral-600' }`} />
              ) : (
                <UserCircleIcon className={`w-16 h-16 mb-2 ${isSelected ? 'text-orange-200' : 'text-neutral-500'}`} />
              )}
              <h3 className="text-md font-semibold text-center">{barber.name}</h3>
              {isSelected && <CheckCircleIcon className="text-white w-5 h-5 absolute top-2 right-2" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
};