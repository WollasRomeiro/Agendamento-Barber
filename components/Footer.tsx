import React from 'react';
import { BARBERSHOP_NAME, BARBERSHOP_ADDRESS } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 py-8 mt-auto border-t border-neutral-700"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-400">
        <p>&copy; 2025 {BARBERSHOP_NAME}. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">{BARBERSHOP_ADDRESS}</p>
        <p className="text-sm mt-2">Design e Desenvolvimento feito por Wollas Romeiro</p>
      </div>
    </footer>
  );
};