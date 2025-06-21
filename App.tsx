
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Alert } from './components/Alert';
import { TabNavigation } from './components/TabNavigation';
import { BookingView } from './components/BookingView';
import { ServicesView } from './components/ServicesView';
import { ContactView } from './components/ContactView';
import { PortfolioView } from './components/PortfolioView'; // Importa o novo componente
import { Service, TabKey } from './types';
import { SERVICES, TAB_OPTIONS, PORTFOLIO_IMAGES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_OPTIONS[0].key);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [initialServiceForBooking, setInitialServiceForBooking] = useState<Service | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      console.warn("API_KEY do Gemini não está configurada. Funcionalidades de IA podem estar limitadas ou usar mensagens padrão.");
    }
  }, []);

  const handleSelectServiceAndBook = useCallback((service: Service) => {
    setInitialServiceForBooking(service);
    setActiveTab('book');
  }, []);

  const clearInitialService = useCallback(() => {
    setInitialServiceForBooking(null);
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-neutral-800 text-neutral-200">
      <Header />
      <TabNavigation 
        tabs={TAB_OPTIONS} 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'book') { 
            clearInitialService();
          }
        }}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiKeyMissing && activeTab === 'book' && (
            <Alert variant="warning" title="Atenção" className="mb-6 max-w-3xl mx-auto">
              A API_KEY do Gemini não está configurada. Mensagens personalizadas por IA podem não estar disponíveis ou usarão um texto padrão.
            </Alert>
        )}

        {activeTab === 'book' && (
          <BookingView 
            key={initialServiceForBooking ? initialServiceForBooking.id : 'booking-view'}
            initialService={initialServiceForBooking}
            onBookingComplete={clearInitialService}
            apiKeyMissing={apiKeyMissing}
          />
        )}
        {activeTab === 'services' && <ServicesView services={SERVICES} onBookService={handleSelectServiceAndBook} />}
        {activeTab === 'portfolio' && <PortfolioView images={PORTFOLIO_IMAGES} />} 
        {activeTab === 'contact' && <ContactView />}
        
      </main>
      <Footer />
    </div>
  );
};

export default App;
