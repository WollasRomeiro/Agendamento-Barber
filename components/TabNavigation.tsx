
import React from 'react';
import { TabKey } from '../types';

interface TabOption {
  key: TabKey;
  label: string;
}

interface TabNavigationProps {
  tabs: TabOption[];
  activeTab: TabKey;
  onTabChange: (tabKey: TabKey) => void;
}

const getIconForTab = (key: TabKey) => {
  switch (key) {
    case 'book':
      return ( // CalendarDaysIcon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008ZM9.75 18.75h.008v.008H9.75v-.008ZM14.25 15h.008v.008H14.25v-.008ZM14.25 18.75h.008v.008H14.25v-.008ZM17.25 15h.008v.008H17.25v-.008Z" />
        </svg>
      );
    case 'services':
      return ( // SparklesIcon (ou similar para services)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 9l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 1.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 9l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 10.5h.008v.008h-.008V10.5ZM18.25 10.5h.008v.008h-.008V10.5Z" />
        </svg>
      );
    case 'portfolio': // Novo ícone para Portfólio
      return ( // CameraIcon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.174C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.174 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
      );
    case 'contact':
      return ( // ChatBubbleLeftEllipsisIcon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12 7.611 3.75 12.375 3.75 21 7.444 21 12Z" />
        </svg>
      );
    default:
      return null;
  }
};

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-neutral-800 border-b border-neutral-700 sticky top-[68px] z-40"> {/* Adjust top value based on header height */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 -mb-px flex space-x-1 sm:space-x-2 justify-center overflow-x-auto whitespace-nowrap" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              inline-flex items-center justify-center px-2 py-3 sm:px-4 sm:py-4 border-b-2 font-medium text-xs sm:text-sm flex-shrink-0
              transition-colors duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-neutral-800 rounded-t-md
              ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-neutral-400 hover:text-orange-400 hover:border-orange-400/50'
              }
            `}
            aria-current={activeTab === tab.key ? 'page' : undefined}
          >
            {getIconForTab(tab.key)}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
