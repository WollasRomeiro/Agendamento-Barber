
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Appointment } from '../types';
import { BARBERSHOP_NAME, GEMINI_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Gemini features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateBookingConfirmationMessage = async (appointment: Appointment): Promise<string> => {
  if (!ai) {
    return `Olá ${appointment.clientName}, seu agendamento para ${appointment.service.name} ${appointment.barber ? `com ${appointment.barber.name}` : ''} em ${appointment.date.toLocaleDateString('pt-BR')} às ${appointment.time} confirmado! Agradecemos a preferência na ${BARBERSHOP_NAME}. (Modo Offline: Mensagem Padrão)`;
  }

  const formattedDate = appointment.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const prompt = `
    Você é um assistente virtual da ${BARBERSHOP_NAME}.
    O cliente ${appointment.clientName} fez um agendamento.
    Crie uma mensagem de confirmação de agendamento que seja amigável, um pouco entusiasmada e profissional, direcionada ao ${appointment.clientName}.
    A mensagem deve ser curta, ideal para WhatsApp.
    Inclua os detalhes do agendamento:
    - Cliente: ${appointment.clientName}
    - Serviço: ${appointment.service.name}
    ${appointment.barber ? `- Barbeiro: ${appointment.barber.name}` : ''}
    - Data: ${formattedDate}
    - Horário: ${appointment.time}
    - Barbearia: ${BARBERSHOP_NAME}
    Termine agradecendo ao cliente e talvez adicionando uma frase curta para criar expectativa positiva (ex: "Estamos ansiosos para te receber, ${appointment.clientName}!").
    Não use markdown na resposta. Retorne apenas o texto da mensagem.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        temperature: 0.7, 
        topP: 0.95,
        topK: 40,
      }
    });
    
    const text = response.text;
    if (text) {
      return text.trim();
    }
    return `Olá ${appointment.clientName}! Seu agendamento ${appointment.barber ? `com ${appointment.barber.name}` : ''} foi confirmado! Estamos ansiosos para recebê-lo(a) na ${BARBERSHOP_NAME}.`; // Fallback
  } catch (error) {
    console.error("Error generating confirmation message with Gemini:", error);
    return `Olá ${appointment.clientName}, seu agendamento para ${appointment.service.name} ${appointment.barber ? `com ${appointment.barber.name}` : ''} em ${appointment.date.toLocaleDateString('pt-BR')} às ${appointment.time} confirmado! Agradecemos a preferência na ${BARBERSHOP_NAME}. (Erro na IA: Mensagem Padrão)`;
  }
};