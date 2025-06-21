
import React from 'react';
// import { Card } from './Card'; // Not used in the current version of PortfolioView

interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
}

interface PortfolioViewProps {
  images: PortfolioImage[];
}

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.174C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.174 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);


export const PortfolioView: React.FC<PortfolioViewProps> = ({ images }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <CameraIcon className="text-orange-500 mx-auto h-12 w-12 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-500">Nosso Portfólio</h1>
        <p className="mt-3 text-lg text-neutral-300">
          Confira alguns dos nossos trabalhos e inspire-se para o seu próximo visual.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group aspect-square bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 border border-neutral-700 hover:border-orange-500/50"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="block w-full h-full object-cover opacity-100"
            />
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-center text-neutral-400 mt-8">Nenhuma imagem no portfólio no momento.</p>
      )}
    </div>
  );
};