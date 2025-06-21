
import React from 'react';
import { Appointment, PaymentMethod } from '../types';
import { Button } from './Button';
import { BARBERSHOP_NAME } from '../constants';
import { formatDateForDisplay } from '../services/appointmentService';

// Orange CheckCircleIcon
const CheckCircleIconSolidOrange: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-12 h-12 text-orange-500 ${className}`}>
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
</svg>
);

const MODAL_TITLE_ID = "confirmation-modal-title";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  geminiMessage: string | null;
  isLoadingGemini: boolean;
}

const getPaymentMethodLabel = (method?: PaymentMethod): string => {
  if (!method) return 'Não especificado';
  switch (method) {
    case 'pix': return 'Pix';
    case 'credit_card': return 'Cartão de Crédito';
    case 'debit_card': return 'Cartão de Débito';
    case 'cash': return 'Dinheiro (no local)';
    default: return 'Não especificado';
  }
};

const getPaymentNote = (method?: PaymentMethod): string | null => {
    if (!method) return null;
    switch (method) {
        case 'pix': return 'Lembre-se de efetuar o pagamento via Pix para garantir seu horário.';
        case 'credit_card': return 'Pagamento com cartão de crédito processado (simulado).';
        case 'debit_card': return 'Pagamento com cartão de débito processado (simulado).';
        case 'cash': return 'O pagamento em dinheiro será realizado no estabelecimento.';
        default: return null;
    }
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, appointment, geminiMessage, isLoadingGemini }) => {
  if (!isOpen || !appointment) return null;

  const { service, barber, date, time, clientName, paymentMethod } = appointment; // Added barber
  const formattedDateString = formatDateForDisplay(date); 
  const paymentMethodLabel = getPaymentMethodLabel(paymentMethod);
  const paymentNote = getPaymentNote(paymentMethod);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
    >
      <div className="bg-neutral-900 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-neutral-700">
        <div className="text-center">
          <CheckCircleIconSolidOrange className="mx-auto mb-4" />
          <h2 id={MODAL_TITLE_ID} className="text-2xl font-bold text-orange-500 mb-3">Agendamento Confirmado!</h2>
        </div>

        <div className="space-y-3 my-6 text-sm text-neutral-300">
          <p><strong>Nome:</strong> <span className="text-white">{clientName}</span></p>
          <p><strong>Serviço:</strong> <span className="text-white">{service.name}</span></p>
          {barber && <p><strong>Barbeiro:</strong> <span className="text-white">{barber.name}</span></p>}
          <p><strong>Data:</strong> <span className="text-white">{formattedDateString}</span></p>
          <p><strong>Horário:</strong> <span className="text-white">{time}</span></p>
          <p><strong>Preço:</strong> <span className="text-white">{service.price}</span></p>
          <p><strong>Forma de Pagamento:</strong> <span className="text-white">{paymentMethodLabel}</span></p>
        </div>

        {paymentNote && (
            <div className="my-4 p-3 bg-neutral-800 rounded-md">
                <p className="text-orange-400 text-xs italic text-center">{paymentNote}</p>
            </div>
        )}

        {isLoadingGemini && (
          <div className="my-4 p-3 bg-neutral-800 rounded-md text-center">
            <p className="text-neutral-300 text-sm animate-pulse">Gerando mensagem personalizada...</p>
          </div>
        )}
        {geminiMessage && !isLoadingGemini && (
          <div className="my-6 p-4 bg-neutral-800 rounded-lg shadow">
            <p className="text-neutral-200 italic leading-relaxed">"{geminiMessage}"</p>
            <p className="text-xs text-neutral-500 mt-2 text-right">- Mensagem da Barbearia ({BARBERSHOP_NAME})</p>
          </div>
        )}
        
        <div className="mt-8 space-y-3">
          <Button onClick={onClose} variant="primary" className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};