import React from 'react';
import { Service } from '../types';
import { Card } from './Card';
// import { Button } from './Button'; // Not used here currently

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  isCompleted: boolean;
  onEdit: () => void;
  isDisabled?: boolean; 
}

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  services, 
  selectedService, 
  onSelectService,
  isCompleted,
  onEdit,
  isDisabled = false,
}) => {
  if (isCompleted && selectedService) {
    return (
      <Card title="1. Serviço Escolhido" onEdit={onEdit} isEditable={!isDisabled} accentBorder={true}>
        <div className="p-4 bg-neutral-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-orange-400">{selectedService.name}</h3>
              <p className="text-sm text-neutral-300 mt-1">
                Duração: {selectedService.durationMinutes} min | Preço: {selectedService.price}
              </p>
            </div>
            <CheckCircleIcon className="text-orange-500 w-6 h-6 flex-shrink-0 ml-3" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="1. Escolha o Serviço" className={isDisabled ? 'opacity-60 pointer-events-none' : ''}>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isDisabled ? 'pointer-events-none' : ''}`}>
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => !isDisabled && onSelectService(service)}
              className={`
                p-4 border rounded-lg text-left transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 
                ${isSelected 
                  ? 'bg-orange-600 border-orange-500 text-white ring-2 ring-orange-400 shadow-lg scale-105' 
                  : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 focus:ring-orange-500 text-neutral-200'}
                ${isDisabled ? 'cursor-not-allowed' : ''}  
              `}
              aria-pressed={isSelected}
              disabled={isDisabled}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className={`text-sm mt-1 ${isSelected ? 'text-orange-100' : 'text-neutral-400'}`}>{service.description}</p>
                  <p className={`text-sm mt-2 font-medium ${isSelected ? 'text-orange-200' : 'text-neutral-300'}`}>
                    Duração: {service.durationMinutes} min | Preço: {service.price}
                  </p>
                </div>
                {isSelected && <CheckCircleIcon className="text-white w-6 h-6 flex-shrink-0 ml-3" />}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};