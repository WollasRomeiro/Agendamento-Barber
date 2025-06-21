import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { BARBERSHOP_ADDRESS, BARBERSHOP_WHATSAPP_NUMBER, BARBERSHOP_NAME } from '../constants';

const PhoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
);

const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);


export const ContactView: React.FC = () => {
  const whatsappLink = `https://wa.me/${BARBERSHOP_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${BARBERSHOP_NAME}, gostaria de mais informações!`)}`;
  const mapsQuery = encodeURIComponent(`${BARBERSHOP_NAME}, ${BARBERSHOP_ADDRESS}`);
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  // IMPORTANT: Replace YOUR_GOOGLE_MAPS_API_KEY with your actual Google Maps Embed API key
  const googleMapsEmbedLink = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapsQuery}`;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center">
         <PhoneIcon className="text-orange-500 mx-auto h-12 w-12 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-500">Entre em Contato</h1>
        <p className="mt-3 text-lg text-neutral-300">
          Estamos aqui para ajudar! Tire suas dúvidas ou venha nos visitar.
        </p>
      </div>

      <Card fullBorder={true}>
        <div className="flex items-start space-x-4">
          <MapPinIcon className="h-8 w-8 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-orange-400 mb-1">Nosso Endereço</h3>
            <p className="text-neutral-200">{BARBERSHOP_ADDRESS}</p>
            <Button 
                variant="secondary" 
                size="sm" 
                className="mt-3"
                onClick={() => window.open(googleMapsLink, '_blank')}
            >
                Ver no Mapa (Google Maps)
            </Button>
          </div>
        </div>
      </Card>

      <Card fullBorder={true}>
        <div className="flex items-start space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-500 mt-1 flex-shrink-0">
            <path d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.3-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5.1-.1.2-.2.4-.4.1-.1.2-.2.2-.3.1-.1.1-.3 0-.4-.1-.1-.6-1.3-.8-1.8-.1-.7-.3-.6-.5-.6h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.3.1.2 1.5 2.3 3.6 3.2.6.2 1.1.4 1.5.5.7.2 1.4.1 1.9-.1.6-.2 1.5-1 1.7-1.9.2-.9.2-1.7.1-1.9-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
          </svg>
          <div>
            <h3 className="text-xl font-semibold text-orange-400 mb-1">WhatsApp</h3>
            <p className="text-neutral-200">{BARBERSHOP_WHATSAPP_NUMBER}</p>
             <Button 
                variant="primary" 
                size="sm" 
                className="mt-3"
                onClick={() => window.open(whatsappLink, '_blank')}
            >
                Chamar no WhatsApp
            </Button>
          </div>
        </div>
      </Card>
      
      <Card title="Localização no Mapa" fullBorder={true}>
        <div className="aspect-w-16 aspect-h-9 bg-neutral-800 rounded-md overflow-hidden">
           <iframe 
            src={googleMapsEmbedLink}
            width="100%" 
            height="100%" 
            className="rounded-md border-0"
            allowFullScreen={false} 
            loading="lazy" 
            aria-hidden="false"
            tabIndex={0}
            title={`Mapa de ${BARBERSHOP_NAME}`}
            referrerPolicy="no-referrer-when-downgrade">
          </iframe> 
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center">
            Se o mapa não carregar, verifique se a chave da API do Google Maps está configurada corretamente.
        </p>
      </Card>
    </div>
  );
};