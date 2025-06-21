
export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: string;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  avatarUrl?: string; // Optional: for displaying an image of the barber
}

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export interface Appointment {
  service: Service;
  barber?: Barber; // Added
  date: Date;
  time: string;
  clientName: string;
  clientContact: string;
  paymentMethod?: PaymentMethod;
}

export interface TimeSlot {
  time: string; // e.g., "09:00"
  isAvailable: boolean; // Future use for more complex availability logic
}

export enum BookingStep {
  SERVICE_SELECTION,
  BARBER_SELECTION, // Added
  DATETIME_SELECTION,
  CONFIRMATION,
}

export type TabKey = 'book' | 'services' | 'contact' | 'portfolio';