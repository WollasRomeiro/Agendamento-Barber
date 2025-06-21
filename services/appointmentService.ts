
import { TimeSlot, Barber } from '../types';
import { BARBERSHOP_OPENING_HOUR, BARBERSHOP_CLOSING_HOUR, TIME_SLOT_INTERVAL_MINUTES } from '../constants';

export const generateAvailableTimeSlots = (
  selectedDate: Date,
  selectedBarberId: string,
  allBookedSlotsGlobal: Array<{ date: string; time: string; barberId: string }>,
  allBarbers: Barber[] // Used to identify actual barbers vs. "Qualquer um"
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();
  const dateStr = selectedDate.toISOString().split('T')[0];

  // ID 'barber3' is assumed to be "Qualquer um"
  const actualBarberIds = allBarbers.filter(b => b.id !== 'barber3').map(b => b.id);
  const countOfActualBarbers = actualBarberIds.length;

  for (let hour = BARBERSHOP_OPENING_HOUR; hour < BARBERSHOP_CLOSING_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += TIME_SLOT_INTERVAL_MINUTES) {
      const slotDate = new Date(selectedDate);
      slotDate.setHours(hour, minute, 0, 0);

      if (isToday && slotDate < now) {
        continue;
      }
      
      // The following conditions were removed as they were redundant
      // due to the outer 'hour' loop condition (hour < BARBERSHOP_CLOSING_HOUR)
      // and one of them contained the TypeScript error:
      // if (hour >= BARBERSHOP_CLOSING_HOUR && minute > 0) {
      //   continue; 
      // }
      //  if (hour === BARBERSHOP_CLOSING_HOUR && minute >= TIME_SLOT_INTERVAL_MINUTES && TIME_SLOT_INTERVAL_MINUTES > 0 ) {
      //    continue;
      // }
      //  if (hour === BARBERSHOP_CLOSING_HOUR && minute === 0 && TIME_SLOT_INTERVAL_MINUTES === 0){ // This line caused the error
      //     continue;
      //  }

      const slotString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      let isSlotBooked = false;

      const bookingsAtThisTimeAndDate = allBookedSlotsGlobal.filter(
        b => b.date === dateStr && b.time === slotString
      );

      if (selectedBarberId !== 'barber3') { // User selected a specific barber (e.g., Rayff or Nicolas)
        // Slot is considered booked if this specific barber has a booking
        // OR if "Qualquer um" has a booking (as "Qualquer um" takes one actual barber slot).
        isSlotBooked = bookingsAtThisTimeAndDate.some(
          b => b.barberId === selectedBarberId || b.barberId === 'barber3'
        );
      } else { // User selected "Qualquer um" (barber3)
        // Slot is booked for "Qualquer um" if all actual barbers are effectively busy at this time.
        // Busy means either a specific booking for an actual barber, or a "Qualquer um" booking.
        const specificBookingsByActualBarbersCount = bookingsAtThisTimeAndDate.filter(
          b => actualBarberIds.includes(b.barberId)
        ).length;

        const qualquerUmBookingsCount = bookingsAtThisTimeAndDate.filter(
          b => b.barberId === 'barber3'
        ).length;
        
        // If the number of specifically booked actual barbers + "Qualquer um" bookings
        // equals or exceeds the total number of actual barbers, then "Qualquer um" cannot be booked.
        if (specificBookingsByActualBarbersCount + qualquerUmBookingsCount >= countOfActualBarbers) {
          isSlotBooked = true;
        }
      }
      
      slots.push({
        time: slotString,
        isAvailable: !isSlotBooked,
      });
    }
  }
  return slots;
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const getMinDate = (): Date => {
  const today = new Date();
  today.setHours(0,0,0,0); // Start of today
  return today;
};
