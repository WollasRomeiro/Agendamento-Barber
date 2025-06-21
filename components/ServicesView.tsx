import React from 'react';
import { Service } from '../types';
import { Card } from './Card';
import { Button } from './Button';

interface ServicesViewProps {
  services: Service[];
  onBookService: (service: Service) => void;
}

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 9l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 1.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 9l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 10.5V18h.008v.008h-.008V10.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 9.75h.008v.008h-.008V9.75ZM12.75 9.75h.008v.008h-.008V9.75Z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 9.75h.008v.008h-.008V9.75Zm0 0V6.375m0 3.375V18m1.5-3.375H9.375m3.375 0h2.25M12.75 9.75V6.375M12.75 18v-2.25m0 0h2.25m-2.25 0H9.375" />
  </svg>
);


export const ServicesView: React.FC<ServicesViewProps> = ({ services, onBookService }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <SparklesIcon className="text-orange-500 mx-auto h-12 w-12 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-500">Nossos Serviços</h1>
        <p className="mt-3 text-lg text-neutral-300">
          Descubra os tratamentos que oferecemos para realçar seu estilo.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className="flex flex-col justify-between"
            title={service.name}
            titleClassName="text-xl font-semibold text-orange-400"
            fullBorder={true}
          >
            <div>
              <p className="text-neutral-300 text-sm mb-3 h-20 overflow-y-auto">{service.description}</p>
              <div className="text-sm space-y-1 mb-6">
                <p className="text-neutral-400">
                  <strong>Duração:</strong> <span className="text-white">{service.durationMinutes} minutos</span>
                </p>
                <p className="text-neutral-400">
                  <strong>Preço:</strong> <span className="text-white font-semibold">{service.price}</span>
                </p>
              </div>
            </div>
            <div className="mt-auto"> {/* Pushes button to the bottom */}
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => onBookService(service)}
              >
                Agendar este Serviço
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};