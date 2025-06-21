
import React from 'react';
import { BARBERSHOP_NAME } from '../constants';

// New Logo URL: Black and white image of a man with a beard
const LOGO_URL = "https://cdn.pixabay.com/photo/2021/03/04/13/47/man-6068200_960_720.png";

export const Header: React.FC = () => {
  return (
    <header className="bg-neutral-800 shadow-lg sticky top-0 z-50 border-b border-neutral-700"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="StudioBarber1002 Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain bg-white rounded-sm p-0.5" // Added bg-white and padding for better visibility if image has transparent parts
            style={{ display: 'block' }} 
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 tracking-tight">
            {BARBERSHOP_NAME}
          </h1>
        </div>
      </div>
    </header>
  );
};