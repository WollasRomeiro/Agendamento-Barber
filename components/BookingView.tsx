
import React, { useState, useEffect, useCallback } from "react";
import { ServiceSelector } from "./ServiceSelector";
import { BarberSelector } from "./BarberSelector"; // Added
import { DateTimePicker } from "./DateTimePicker";
import { ConfirmationModal } from "./ConfirmationModal";
import { Button } from "./Button";
import { Card } from "./Card";
import { Alert } from "./Alert";
import { StepIndicator } from "./StepIndicator";
import { Service, Appointment, TimeSlot, PaymentMethod, Barber } from "../types"; // Added Barber
import {
  SERVICES,
  BARBERS, 
  BARBERSHOP_NAME,
  STATIC_PIX_QR_CODE_URL,
  EXAMPLE_PIX_KEY,
  BARBERSHOP_NOTIFICATION_WHATSAPP_NUMBER,
} from "../constants";
import {
  generateAvailableTimeSlots,
  formatDateForDisplay,
} from "../services/appointmentService";
import { generateBookingConfirmationMessage } from "../services/geminiService";

type UiStep = "service" | "barber" | "datetime" | "details" | "payment"; 

const BOOKING_STEPS = [
  { id: "service", name: "Serviço" },
  { id: "barber", name: "Barbeiro" }, 
  { id: "datetime", name: "Data e Hora" },
  { id: "details", name: "Seus Dados" },
  { id: "payment", name: "Pagamento" },
];

// Icons for Payment Methods (remains the same)
const PixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-6 h-6 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.63 15.88L12.06 13.04L7.5 15.88L9.03 10.78L5 7.4L10.27 7.11L12.06 2.33L13.86 7.11L19.13 7.4L15.1 10.78L16.63 15.88Z"
      fill="currentColor"
    />
  </svg>
);
const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);
const CashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

interface BookingViewProps {
  initialService: Service | null;
  onBookingComplete: () => void;
  apiKeyMissing: boolean;
}

// This will store bookings made during the session to simulate a database.
// It will be reset on page refresh.
let sessionBookedSlots: Array<{ date: string; time: string; barberId: string }> = [];


export const BookingView: React.FC<BookingViewProps> = ({
  initialService,
  onBookingComplete,
  apiKeyMissing,
}) => {
  const [uiStep, setUiStep] = useState<UiStep>(
    initialService ? "barber" : "service" 
  );
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialService
  );
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [bookedAppointment, setBookedAppointment] =
    useState<Appointment | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [geminiMessage, setGeminiMessage] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // State to reflect globally (session-wide) booked slots
  const [globallyBookedSlots, setGloballyBookedSlots] = useState<Array<{ date: string; time: string; barberId: string }>>(sessionBookedSlots);

  const updateAvailableSlots = useCallback(() => {
    if (selectedDate && selectedBarber) {
      const slots = generateAvailableTimeSlots(selectedDate, selectedBarber.id, globallyBookedSlots, BARBERS);
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]); 
    }
  }, [selectedDate, selectedBarber, globallyBookedSlots]);

  useEffect(() => {
    updateAvailableSlots();
  }, [updateAvailableSlots]);


  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setUiStep("barber"); 
    }
  }, [initialService]);

  const resetToStep = (step: UiStep) => {
    setUiStep(step);
    setGeneralError(null);
    setNameError(null);
    setContactError(null);
    
    if (step === "service" || step === "barber" || step === "datetime" || step === "details") {
      setSelectedPaymentMethod(null);
    }

    if (step === "service") {
      setSelectedService(null);
      setSelectedBarber(null); 
      setSelectedDate(null);
      setSelectedTime(null);
      // availableTimeSlots will be cleared by updateAvailableSlots
      setClientName("");
      setClientContact("");
      if (initialService) onBookingComplete(); 
    } else if (step === "barber") {
      setSelectedBarber(null); 
      setSelectedDate(null);
      setSelectedTime(null);
      // availableTimeSlots will be cleared by updateAvailableSlots
    } else if (step === "datetime") {
      setSelectedDate(null);
      setSelectedTime(null);
      // availableTimeSlots will be cleared by updateAvailableSlots
    }
  };

  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedBarber(null); 
    setSelectedDate(null);
    setSelectedTime(null);
    // availableTimeSlots will be updated by effect
    setGeneralError(null);
    setNameError(null);
    setContactError(null);
    setSelectedPaymentMethod(null);
    setUiStep("barber"); 
  }, []);

  const handleEditService = () => resetToStep("service");

  const handleBarberSelect = useCallback((barber: Barber) => {
    setSelectedBarber(barber);
    setSelectedDate(null); 
    setSelectedTime(null);
    // availableTimeSlots will be updated by effect
    setGeneralError(null);
    setNameError(null);
    setContactError(null);
    setSelectedPaymentMethod(null);
    setUiStep("datetime"); 
  }, []);

  const handleEditBarber = () => resetToStep("barber");

  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setSelectedTime(null); 
      // availableTimeSlots will be updated by effect if barber is also selected
      setSelectedPaymentMethod(null);
      setGeneralError(null);
      setNameError(null);
      setContactError(null);
    },
    [] 
  );

  const handleTimeSelect = useCallback((time: string) => {
    // Check if the slot is actually available before selecting
    const selectedSlot = availableTimeSlots.find(slot => slot.time === time);
    if (selectedSlot && !selectedSlot.isAvailable) {
        setGeneralError("Este horário não está mais disponível. Por favor, escolha outro.");
        // Re-fetch/update slots in case availability changed very recently
        if (selectedDate && selectedBarber) {
             const freshSlots = generateAvailableTimeSlots(selectedDate, selectedBarber.id, globallyBookedSlots, BARBERS);
             setAvailableTimeSlots(freshSlots);
        }
        return;
    }

    setSelectedTime(time);
    setGeneralError(null);
    setNameError(null);
    setContactError(null);
    setSelectedPaymentMethod(null);
    setUiStep("details");
  }, [availableTimeSlots, selectedDate, selectedBarber, globallyBookedSlots]);

  const handleEditDateTime = () => resetToStep("datetime");
  const handleEditDetails = () => resetToStep("details");

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!clientName.trim()) {
      setNameError("O nome é obrigatório.");
      isValid = false;
    } else {
      setNameError(null);
    }

    const phoneRegex = /^\+?[0-9\s-()]{10,20}$/;
    if (!clientContact.trim()) {
      setContactError("O número de contato é obrigatório.");
      isValid = false;
    } else if (!phoneRegex.test(clientContact)) {
      setContactError(
        "Número de contato inválido. Ex: (XX) XXXXX-XXXX ou +55XX9XXXXXXXX."
      );
      isValid = false;
    } else {
      setContactError(null);
    }
    return isValid;
  };

  const handleProceedToPayment = () => {
    if (validateInputs()) {
      setGeneralError(null);
      setUiStep("payment");
    } else {
      setGeneralError(
        "Por favor, corrija os erros nos seus dados antes de continuar."
      );
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setGeneralError(null);
  };

  const sendAutomatedBarbershopNotification = async (
    appointment: Appointment
  ): Promise<void> => {
    console.log(
      "[BookingView] Attempting to send automated barbershop notification via backend..."
    );
    const payload = {
      targetNumber: BARBERSHOP_NOTIFICATION_WHATSAPP_NUMBER, 
      message: `🔔 NOVO AGENDAMENTO (${BARBERSHOP_NAME}) 🔔
Cliente: ${appointment.clientName}
Contato Cliente: ${appointment.clientContact}
Serviço: ${appointment.service.name}
Barbeiro: ${appointment.barber?.name || 'Não especificado'}
Data: ${formatDateForDisplay(appointment.date)}
Horário: ${appointment.time}
Valor: ${appointment.service.price}
Pagamento: ${selectedPaymentMethod || "Não especificado"}
(Esta é uma notificação automática)`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    try {
      const response = await fetch(
        "http://localhost:3333/api/send-whatsapp-message", // Generic endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const responseData = await response.json();
        console.log(
          "[BookingView] Automated barbershop notification sent successfully via backend:",
          responseData
        );
      } else {
        const errorData = await response.text();
        console.error(
          `[BookingView] Failed to send automated barbershop notification. Status: ${response.status}. Details:`,
          errorData
        );
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        console.error(
          "[BookingView] Automated barbershop notification request timed out."
        );
      } else {
        console.error(
          "[BookingView] Error sending automated barbershop notification:",
          error
        );
      }
    }
  };

  const sendClientConfirmationWhatsApp = async (
    appointment: Appointment,
    message: string
  ): Promise<void> => {
    console.log(
      "[BookingView] Attempting to send client confirmation WhatsApp via backend..."
    );
    
    const formattedClientContact = appointment.clientContact.replace(/\D/g, '');
    if (!formattedClientContact) {
        console.error("[BookingView] Invalid client contact number for WhatsApp.");
        return;
    }

    const payload = {
      targetNumber: formattedClientContact, 
      message: message, 
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    try {
      const response = await fetch(
        "http://localhost:3333/api/send-whatsapp-message", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const responseData = await response.json();
        console.log(
          "[BookingView] Client confirmation WhatsApp sent successfully via backend:",
          responseData
        );
      } else {
        const errorData = await response.text();
        console.error(
          `[BookingView] Failed to send client confirmation WhatsApp. Status: ${response.status}. Details:`,
          errorData
        );
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        console.error(
          "[BookingView] Client confirmation WhatsApp request timed out."
        );
      } else {
        console.error(
          "[BookingView] Error sending client confirmation WhatsApp:",
          error
        );
      }
    }
  };


  const handleBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) { 
      setGeneralError(
        "Por favor, complete a seleção de serviço, barbeiro, data e horário."
      );
      setUiStep(
        selectedService ? (selectedBarber ? "datetime" : "barber") : "service" 
      );
      return;
    }
    // Final check for slot availability before booking
    const currentSlots = generateAvailableTimeSlots(selectedDate, selectedBarber.id, globallyBookedSlots, BARBERS);
    const chosenSlot = currentSlots.find(s => s.time === selectedTime);
    if (!chosenSlot || !chosenSlot.isAvailable) {
        setGeneralError(`O horário ${selectedTime} não está mais disponível para ${selectedBarber.name}. Por favor, escolha outro horário ou data.`);
        setAvailableTimeSlots(currentSlots); // Update UI with latest availability
        setUiStep("datetime");
        return;
    }


    if (
      !clientName.trim() ||
      !clientContact.trim() ||
      nameError ||
      contactError
    ) {
      setGeneralError("Dados do cliente incompletos ou inválidos.");
      setUiStep("details");
      return;
    }
    if (!selectedPaymentMethod) {
      setGeneralError("Por favor, selecione um método de pagamento.");
      setUiStep("payment");
      return;
    }

    setGeneralError(null);
    setIsBooking(true);

    const appointment: Appointment = {
      service: selectedService,
      barber: selectedBarber, 
      date: selectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      paymentMethod: selectedPaymentMethod,
    };
    
    // Add to our session-wide booked slots
    const newBookedSlot = {
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        barberId: appointment.barber.id, 
    };
    sessionBookedSlots = [...sessionBookedSlots, newBookedSlot];
    setGloballyBookedSlots(sessionBookedSlots); // Update state to trigger re-renders/slot updates
    
    await sendAutomatedBarbershopNotification(appointment);

    let generatedMsgForClient: string;
    if (!apiKeyMissing) {
      setIsLoadingGemini(true);
      try {
        generatedMsgForClient = await generateBookingConfirmationMessage(appointment);
      } catch (e: any) {
        console.error("Gemini API error:", e);
        generatedMsgForClient = `Olá ${appointment.clientName}, seu agendamento para ${
          appointment.service.name
        } com ${appointment.barber?.name || 'nosso profissional'} em ${formatDateForDisplay(appointment.date)} às ${
          appointment.time
        } na ${BARBERSHOP_NAME} confirmado! (Erro ao gerar mensagem IA)`;
      }
      setIsLoadingGemini(false);
    } else {
      generatedMsgForClient = `Olá ${appointment.clientName}, seu agendamento para ${
        selectedService.name
      } com ${selectedBarber.name || 'nosso profissional'} em ${formatDateForDisplay(
        selectedDate
      )} às ${selectedTime} na ${BARBERSHOP_NAME} foi recebido! Agradecemos a preferência.`;
    }
    
     if (typeof generatedMsgForClient !== "string" || generatedMsgForClient.trim() === "") {
        console.warn(
            `[BookingView] generatedMsgForClient was problematic. Using ultimate fallback.`
        );
        generatedMsgForClient = `Seu agendamento para ${appointment.service.name} com ${appointment.barber?.name || 'nosso profissional'} em ${formatDateForDisplay(appointment.date)} às ${appointment.time} foi confirmado com sucesso na ${BARBERSHOP_NAME}! Agradecemos a preferência. (Mensagem de Sistema Padrão)`;
    }

    await sendClientConfirmationWhatsApp(appointment, generatedMsgForClient.trim());
    
    setBookedAppointment(appointment);
    setGeminiMessage(generatedMsgForClient.trim()); 
    setIsConfirmationModalOpen(true);
    setIsBooking(false);
  };

  const resetBookingProcess = () => {
    resetToStep("service");
    setBookedAppointment(null);
    setIsConfirmationModalOpen(false);
    setGeminiMessage(null);
    setIsBooking(false);
    onBookingComplete();
  };

  const canConfirmBooking =
    selectedService &&
    selectedBarber && 
    selectedDate &&
    selectedTime &&
    clientName.trim() &&
    !nameError &&
    clientContact.trim() &&
    !contactError &&
    selectedPaymentMethod &&
    !isBooking;

  return (
    <div className="max-w-3xl mx-auto space-y-8" aria-busy={isBooking}>
      {isConfirmationModalOpen && bookedAppointment ? (
        <ConfirmationModal
          isOpen={true}
          onClose={resetBookingProcess}
          appointment={bookedAppointment}
          geminiMessage={geminiMessage}
          isLoadingGemini={isLoadingGemini}
        />
      ) : (
        <>
          <StepIndicator steps={BOOKING_STEPS} currentStepId={uiStep} />

          {generalError && (uiStep === "payment" || uiStep === "details" || uiStep === "datetime") && (
            <Alert variant="error" className="mb-6">
              {generalError}
            </Alert>
          )}

          <ServiceSelector
            services={SERVICES}
            selectedService={selectedService}
            onSelectService={handleServiceSelect}
            isCompleted={uiStep !== "service" && !!selectedService}
            onEdit={handleEditService}
            isDisabled={
              uiStep !== "service" && !selectedService && !initialService
            }
          />
          
          {(uiStep === "barber" || uiStep === "datetime" || uiStep === "details" || uiStep === "payment") && selectedService && (
            <BarberSelector
              barbers={BARBERS}
              selectedBarber={selectedBarber}
              onSelectBarber={handleBarberSelect}
              isCompleted={(uiStep !== "barber" && !!selectedBarber)}
              onEdit={handleEditBarber}
              isDisabled={uiStep !== "barber"}
            />
          )}

          {(uiStep === "datetime" ||
            uiStep === "details" ||
            uiStep === "payment") &&
            selectedService && selectedBarber && ( 
              <DateTimePicker
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                availableTimeSlots={availableTimeSlots}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                isDisabled={uiStep !== "datetime"}
                isCompleted={
                  (uiStep === "details" || uiStep === "payment") &&
                  !!selectedDate &&
                  !!selectedTime
                }
                onEdit={handleEditDateTime}
                serviceName={selectedService.name}
                barberName={selectedBarber.name} 
              />
            )}

          {(uiStep === "details" || uiStep === "payment") &&
            selectedService &&
            selectedBarber && 
            selectedDate &&
            selectedTime && (
              <Card
                title={`4. Seus Dados`} 
                onEdit={handleEditDetails}
                isEditable={uiStep === "details"}
                accentBorder={
                  uiStep === "payment" ||
                  (uiStep === "details" &&
                    !!clientName &&
                    !!clientContact &&
                    !nameError &&
                    !contactError)
                }
              >
                {uiStep === "details" ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="client-name"
                          className="block text-sm font-medium text-neutral-300 mb-1"
                        >
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          id="client-name"
                          value={clientName}
                          onChange={(e) => {
                            setClientName(e.target.value);
                            setNameError(null);
                            setGeneralError(null);
                          }}
                          className={`w-full bg-neutral-800 border rounded-md p-3 text-neutral-100 focus:ring-orange-500 focus:border-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                            nameError
                              ? "border-orange-600"
                              : "border-neutral-700"
                          }`}
                          placeholder="Seu nome completo"
                          aria-invalid={!!nameError}
                          aria-describedby={
                            nameError ? "name-error-message" : undefined
                          }
                          required
                        />
                        {nameError && (
                          <p
                            id="name-error-message"
                            className="text-orange-400 text-xs mt-1"
                          >
                            {nameError}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="client-contact"
                          className="block text-sm font-medium text-neutral-300 mb-1"
                        >
                          Número de Contato (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          id="client-contact"
                          value={clientContact}
                          onChange={(e) => {
                            setClientContact(e.target.value);
                            setContactError(null);
                            setGeneralError(null);
                          }}
                          className={`w-full bg-neutral-800 border rounded-md p-3 text-neutral-100 focus:ring-orange-500 focus:border-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                            contactError
                              ? "border-orange-600"
                              : "border-neutral-700"
                          }`}
                          placeholder="(XX) XXXXX-XXXX ou +55XX9XXXXXXXX"
                          aria-invalid={!!contactError}
                          aria-describedby={
                            contactError ? "contact-error-message" : undefined
                          }
                          required
                        />
                        {contactError && (
                          <p
                            id="contact-error-message"
                            className="text-orange-400 text-xs mt-1"
                          >
                            {contactError}
                          </p>
                        )}
                      </div>
                    </div>
                    {generalError && uiStep === "details" && (
                      <Alert variant="error" className="mt-4">
                        {generalError}
                      </Alert>
                    )}
                    <Button
                      onClick={handleProceedToPayment}
                      disabled={
                        !clientName.trim() ||
                        !clientContact.trim() ||
                        !!nameError ||
                        !!contactError
                      }
                      variant="primary"
                      size="lg"
                      className="w-full mt-6"
                    >
                      Prosseguir para Pagamento
                    </Button>
                  </>
                ) : (
                  <div className="p-4 bg-neutral-800 rounded-lg">
                    <p className="text-neutral-300">
                      <strong>Nome:</strong> {clientName}
                    </p>
                    <p className="text-neutral-300">
                      <strong>Contato:</strong> {clientContact}
                    </p>
                  </div>
                )}
              </Card>
            )}

          {uiStep === "payment" &&
            selectedService &&
            selectedBarber && 
            selectedDate &&
            selectedTime &&
            clientName &&
            clientContact && (
              <Card title="5. Pagamento" accentBorder={true}> 
                <div className="space-y-4">
                  <p className="text-sm text-neutral-400">
                    Escolha como deseja pagar o valor de{" "}
                    <strong className="text-orange-400">
                      {selectedService.price}
                    </strong>
                    .
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(
                      [
                        "pix",
                        "credit_card",
                        "debit_card",
                        "cash",
                      ] as PaymentMethod[]
                    ).map((method) => {
                      const icons: Record<PaymentMethod, React.ReactNode> = {
                        pix: <PixIcon className="mr-2" />,
                        credit_card: <CreditCardIcon className="mr-2" />,
                        debit_card: <CreditCardIcon className="mr-2" />,
                        cash: <CashIcon className="mr-2" />,
                      };
                      const labels: Record<PaymentMethod, string> = {
                        pix: "Pix",
                        credit_card: "Crédito",
                        debit_card: "Débito",
                        cash: "Dinheiro",
                      };
                      return (
                        <Button
                          key={method}
                          variant={
                            selectedPaymentMethod === method
                              ? "primary"
                              : "light-outline"
                          }
                          onClick={() => handlePaymentMethodSelect(method)}
                          className="w-full justify-start text-left py-3 px-3 text-sm"
                          icon={icons[method]}
                        >
                          {labels[method]}
                        </Button>
                      );
                    })}
                  </div>

                  {selectedPaymentMethod === "pix" && (
                    <div className="mt-4 p-4 border border-orange-500/30 rounded-lg bg-neutral-800 text-center space-y-3">
                      <img
                        src={STATIC_PIX_QR_CODE_URL}
                        alt="QR Code Pix"
                        className="mx-auto w-40 h-40 border border-neutral-700 rounded-md"
                      />
                      <p className="text-sm text-neutral-300">
                        Escaneie o QR Code ou use a chave:
                      </p>
                      <p className="text-md font-semibold text-orange-400 break-all">
                        {EXAMPLE_PIX_KEY}
                      </p>
                      <p className="text-xs text-neutral-500">
                        (Este é um QR Code de exemplo e não processa pagamentos
                        reais)
                      </p>
                    </div>
                  )}

                  {(selectedPaymentMethod === "credit_card" ||
                    selectedPaymentMethod === "debit_card") && (
                    <div className="mt-4 p-4 border border-orange-500/30 rounded-lg bg-neutral-800 space-y-3">
                      <p className="text-sm text-center text-orange-400 font-semibold">
                        Simulação de Pagamento com Cartão
                      </p>
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                          Número do Cartão (simulado)
                        </label>
                        <input
                          type="text"
                          placeholder="**** **** **** ****"
                          className="w-full bg-neutral-700 p-2 rounded text-sm text-neutral-200"
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">
                            Validade (simulado)
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-full bg-neutral-700 p-2 rounded text-sm text-neutral-200"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">
                            CVV (simulado)
                          </label>
                          <input
                            type="text"
                            placeholder="***"
                            className="w-full bg-neutral-700 p-2 rounded text-sm text-neutral-200"
                            disabled
                          />
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2 text-center">
                        (Campos apenas para demonstração. Nenhum dado de cartão
                        é coletado.)
                      </p>
                    </div>
                  )}
                  {selectedPaymentMethod === "cash" && (
                    <Alert variant="info" className="mt-4">
                      Pagamento em dinheiro será realizado diretamente no
                      estabelecimento.
                    </Alert>
                  )}
                  {generalError && uiStep === "payment" && (
                    <Alert variant="error" className="mt-4">
                      {generalError}
                    </Alert>
                  )}
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={!canConfirmBooking}
                  isLoading={isBooking}
                  size="lg"
                  variant="primary"
                  className="w-full mt-6"
                >
                  {isBooking
                    ? "Agendando..."
                    : "Confirmar Agendamento e Pagamento"}
                </Button>
              </Card>
            )}
        </>
      )}
    </div>
  );
};