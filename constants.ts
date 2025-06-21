
import { Service, TabKey, Barber } from './types';

export const BARBERSHOP_NAME = "StudioBarber1002";
export const BARBERSHOP_ADDRESS = "RUA PAPA JOAO XXIII, 1002, LIBERDADE, Campina Grande - PB, 58414-300";

// Este é o número que os clientes podem usar para entrar em contato ou que aparece no link de compartilhamento do cliente.
export const BARBERSHOP_WHATSAPP_NUMBER = "5583987620854"; 

// Este é o número da barbearia que receberá a notificação de um novo agendamento.
export const BARBERSHOP_NOTIFICATION_WHATSAPP_NUMBER = "5583981927402"; 

export const SERVICES: Service[] = [
  { id: "1", name: "Corte Social", durationMinutes: 30, price: "R$ 25,00", description: "Corte clássico e elegante, ideal para o dia a dia e ocasiões formais." },
  { id: "2", name: "Corte Navalhado", durationMinutes: 45, price: "R$ 25,00", description: "Corte moderno com degradê e acabamento preciso na navalha, para um visual marcante." },
  { id: "3", name: "Corte Infantil", durationMinutes: 30, price: "R$ 25,00", description: "Corte especial para crianças, realizado com paciência e adaptado ao estilo dos pequenos." },
  { id: "4", name: "Barba", durationMinutes: 30, price: "R$ 18,00", description: "Modelagem e design de barba, utilizando técnicas tradicionais para um acabamento impecável." },
  { id: "5", name: "Sobrancelha", durationMinutes: 15, price: "R$ 10,00", description: "Design e limpeza de sobrancelhas (masculina ou feminina), realçando o olhar e a expressão." },
  { id: "6", name: "Pezinho do Cabelo", durationMinutes: 10, price: "R$ 5,00", description: "Acabamento do contorno do cabelo (nuca e costeletas), para manter o corte sempre em dia." },
];

export const BARBERS: Barber[] = [
  { id: "barber1", name: "Rayff", avatarUrl: "https://storage.googleapis.com/genai-downloads/images/barber_rayff_avatar.png" }, // Placeholder avatar
  { id: "barber2", name: "Nicolas", avatarUrl: "https://storage.googleapis.com/genai-downloads/images/barber_nicolas_avatar.png" }, // Placeholder avatar
  { id: "barber3", name: "Qualquer um", avatarUrl: undefined } // Option for any barber
];

export const BARBERSHOP_OPENING_HOUR = 9; // 9 AM
export const BARBERSHOP_CLOSING_HOUR = 19; // 7 PM
export const TIME_SLOT_INTERVAL_MINUTES = 30;

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const TAB_OPTIONS: { key: TabKey, label: string }[] = [
  { key: 'book', label: 'Agendar' },
  { key: 'services', label: 'Nossos Serviços' },
  { key: 'portfolio', label: 'Portfólio' },
  { key: 'contact', label: 'Contato' },
];

export const PORTFOLIO_IMAGES = [
  { id: 'p1', src: 'https://storage.googleapis.com/genai-downloads/images/portfolio_image_1.jpg', alt: 'Homem com cabelo e barba grisalhos estilizados.' },
  { id: 'p2', src: 'https://storage.googleapis.com/genai-downloads/images/portfolio_image_2.jpg', alt: 'Barbeiro profissional trabalhando no cabelo de um cliente na barbearia.' },
  { id: 'p3', src: 'https://storage.googleapis.com/genai-downloads/images/portfolio_image_3.jpg', alt: 'Close-up do perfil lateral de um homem com barba bem aparada.' },
  { id: 'p4', src: 'https://storage.googleapis.com/genai-downloads/images/portfolio_image_4.jpg', alt: 'Homem com corte de cabelo moderno e barba desenhada.' },
  { id: 'p5', src: 'https://storage.googleapis.com/genai-downloads/images/portfolio_image_5.jpg', alt: 'Jovem com design de corte de cabelo artístico e detalhado.' },
];

// For payment simulation
export const STATIC_PIX_QR_CODE_URL = "https://storage.googleapis.com/genai-downloads/images/example_qr_code.png"; 
export const EXAMPLE_PIX_KEY = "chave.pix.exemplo@email.com";