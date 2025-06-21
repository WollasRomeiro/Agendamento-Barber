
import React from 'react';
import { TimeSlot } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { Alert } from './Alert';
import { formatDateForDisplay, getMinDate } from '../services/appointmentService';

interface DateTimePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  availableTimeSlots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isDisabled: boolean; 
  isCompleted: boolean; 
  onEdit: () => void; 
  serviceName?: string;
  barberName?: string; // Added
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  onDateChange,
  availableTimeSlots,
  selectedTime,
  onTimeSelect,
  isDisabled,
  isCompleted,
  onEdit,
  serviceName,
  barberName, // Added
}) => {
  const minDate = getMinDate();
  const minDateString = minDate.toISOString().split('T')[0];

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-').map(Number);
      const newDate = new Date(year, month - 1, day); 
      onDateChange(newDate);
    }
  };

  let titleText = "3. Escolha Data e Horário"; // Updated step number
  if (serviceName && (isDisabled || isCompleted)) {
    titleText += ` para ${serviceName}`;
  }
  if (barberName && (isDisabled || isCompleted)) {
    titleText += ` com ${barberName}`;
  }

  const cardTitle = titleText;

  if (isCompleted && selectedDate && selectedTime) {
    return (
       <Card title={`3. Data e Horário Escolhidos`} onEdit={onEdit} accentBorder={true}> {/* Updated step number */}
        <div className="p-4 bg-neutral-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-orange-400">
                {formatDateForDisplay(selectedDate)} às {selectedTime}
              </h3>
              {barberName && <p className="text-sm text-neutral-300 mt-1">Barbeiro: {barberName}</p>}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-orange-500">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title={cardTitle} className={isDisabled ? 'opacity-60 pointer-events-none' : ''}>
      <div className="space-y-6">
        <div>
          <label htmlFor="appointment-date" className="block text-sm font-medium text-neutral-300 mb-1">
            Data do Agendamento
          </label>
          <input
            type="date"
            id="appointment-date"
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
            onChange={handleDateInputChange}
            min={minDateString}
            className="w-full bg-neutral-800 border-neutral-700 text-neutral-100 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 appearance-none"
            disabled={isDisabled}
            style={{ colorScheme: 'dark' }} 
            aria-label="Selecione a data para o agendamento"
          />
          {selectedDate && (
             <p className="mt-2 text-sm text-orange-400">{formatDateForDisplay(selectedDate)}</p>
          )}
        </div>

        {selectedDate && (
          <div>
            <h4 className="text-md font-medium text-neutral-300 mb-3">Horários Disponíveis:</h4>
            {availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {availableTimeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => onTimeSelect(slot.time)}
                    disabled={!slot.isAvailable || isDisabled}
                    className="w-full"
                    aria-pressed={selectedTime === slot.time}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
               <Alert variant="info" showIcon={true} title="Sem horários">
                Nenhum horário disponível para esta data. Por favor, tente selecionar outra data.
              </Alert>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};