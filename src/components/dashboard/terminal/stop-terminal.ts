import { Dispatch, SetStateAction } from 'react';
import { BASE_URL } from '@/config';

export function startTerminal(
  setMessages: Dispatch<SetStateAction<any[]>>,
  setIsTerminalRunning: Dispatch<SetStateAction<boolean>>,
  setEventSource: Dispatch<SetStateAction<EventSource | null>>
) {
  const newEventSource = new EventSource(`${BASE_URL}/sse/events`);

  newEventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received message:', data);
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  newEventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    newEventSource.close();
    setIsTerminalRunning(false);
  };

  setEventSource(newEventSource);
  setIsTerminalRunning(true);
}


export function stopTerminal(
  eventSource: EventSource | null,
  setEventSource: Dispatch<SetStateAction<EventSource | null>>,
  setIsTerminalRunning: Dispatch<SetStateAction<boolean>>
) {
  if (eventSource) {
    eventSource.close();
    setEventSource(null);
    setIsTerminalRunning(false);
    console.log('Terminal stopped');
  }
}
