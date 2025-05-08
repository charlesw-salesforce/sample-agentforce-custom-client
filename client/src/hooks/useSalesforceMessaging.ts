import { useCallback } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface MessagingCredentials {
  accessToken: string;
  conversationId: string;
}

interface MessagingHookReturn {
  initialize: () => Promise<MessagingCredentials>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  closeChat: (conversationId: string) => Promise<void>;
  setupEventSource: (conversationId: string) => EventSource;
}

export function useSalesforceMessaging(): MessagingHookReturn {
  const initialize = useCallback(async (): Promise<MessagingCredentials> => {
    const response = await fetch(`${API_BASE_URL}/chat/init`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to initialize chat");
    return response.json();
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId, text: content }),
      });

      if (!response.ok) throw new Error("Failed to send message");
    },
    []
  );

  const closeChat = useCallback(
    async (conversationId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/chat/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId }),
      });

      if (!response.ok) throw new Error("Failed to close chat");
    },
    []
  );

  const setupEventSource = useCallback(
    (conversationId: string): EventSource => {
      return new EventSource(`${API_BASE_URL}/chat/events/${conversationId}`, {
        withCredentials: true,
      });
    },
    []
  );

  return {
    initialize,
    sendMessage,
    closeChat,
    setupEventSource,
  };
}
