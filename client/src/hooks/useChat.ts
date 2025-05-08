import { useState, useEffect, useRef, useCallback } from "react";
import { Entry, Message } from "../types";
import { useSalesforceMessaging } from "./useSalesforceMessaging";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  const {
    initialize,
    sendMessage: sendMessageToApi,
    closeChat: closeChatApi,
    setupEventSource,
  } = useSalesforceMessaging();

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!conversationIdRef.current || !isConnected) return;

      try {
        await closeChatApi(conversationIdRef.current);
        setIsConnected(false);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: "system",
            content: "Chat ended due to inactivity",
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.error("Failed to end chat:", err);
      }
    }, INACTIVITY_TIMEOUT);
  }, [isConnected, closeChatApi]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const { data: eventData } = JSON.parse(event.data);
        const data = JSON.parse(eventData);
        if (data.conversationEntry.entryType === "Message") {
          setIsTyping(false);
          const payload = JSON.parse(data.conversationEntry.entryPayload);
          const messageType =
            data.conversationEntry.sender.role === "EndUser" ? "user" : "ai";

          if (messageType === "ai") {
            setMessages((prev) => [
              ...prev,
              {
                id: payload.abstractMessage.id,
                type: messageType,
                content: payload.abstractMessage.staticContent.text,
                timestamp: new Date(data.conversationEntry.clientTimestamp),
              },
            ]);
            setIsLoading(false);
          }
          resetTimeout();
        }
      } catch (err) {
        console.error("Message parse error:", err);
      }
    },
    [resetTimeout]
  );

  const handleParticipantChange = useCallback((event: MessageEvent) => {
    try {
      const { data: eventData } = JSON.parse(event.data);
      const data = JSON.parse(eventData);
      if (data.conversationEntry.entryType === "ParticipantChanged") {
        const entries = JSON.parse(data.conversationEntry.entryPayload).entries;

        entries.forEach((entry: Entry) => {
          if (
            entry.operation === "add" &&
            entry.participant.role.toLowerCase() === "chatbot"
          ) {
            setCurrentAgent(entry.displayName);
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                type: "system",
                content: `${entry.displayName} has joined the chat`,
                timestamp: new Date(),
              },
            ]);
          }
          if (
            entry.operation === "remove" &&
            entry.participant.role === "agent"
          ) {
            setCurrentAgent(null);
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                type: "system",
                content: `${entry.displayName} has left the chat`,
                timestamp: new Date(),
              },
            ]);
          }
        });
      }
    } catch (err) {
      console.error("Participant change parse error:", err);
    }
  }, []);

  const handleIncomingEvent = useCallback(
    (event: MessageEvent) => {
      try {
        const { event: eventType } = JSON.parse(event.data);

        switch (eventType) {
          case "CONVERSATION_MESSAGE":
            handleMessage(event);
            break;
          case "CONVERSATION_PARTICIPANT_CHANGED":
            handleParticipantChange(event);
            break;
          case "CONVERSATION_TYPING_STARTED_INDICATOR":
            if (!isLoading) setIsTyping(true);
            resetTimeout();
            break;
          case "CONVERSATION_TYPING_STOPPED_INDICATOR":
            setIsTyping(false);
            break;
        }
      } catch (err) {
        console.error("Event parse error:", err);
      }
    },
    [isLoading, resetTimeout, handleMessage, handleParticipantChange]
  );

  const setupEventHandlers = useCallback(
    (events: EventSource) => {
      events.onopen = () => {
        setIsConnected(true);
        resetTimeout();
      };

      events.onerror = (error) => {
        console.error("EventSource error:", error);
        setIsConnected(false);
      };

      events.addEventListener("message", handleIncomingEvent);
    },
    [resetTimeout, handleIncomingEvent]
  );

  const startChat = useCallback(async () => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setMessages([]);
      setIsLoading(false);
      setIsTyping(false);
      setCurrentAgent(null);
      setError(null);

      const { conversationId } = await initialize();
      conversationIdRef.current = conversationId;

      const events = setupEventSource(conversationId);
      eventSourceRef.current = events;
      setupEventHandlers(events);
    } catch (err) {
      console.error("Chat initialization error:", err);
      setError("Failed to start chat");
      setIsConnected(false);
    }
  }, [initialize, setupEventSource, setupEventHandlers]);

  const sendMessage = async (content: string) => {
    if (!conversationIdRef.current) return;
    resetTimeout();

    try {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "user",
          content,
          timestamp: new Date(),
        },
      ]);

      setIsLoading(true);
      await sendMessageToApi(conversationIdRef.current, content);
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
      setIsLoading(false);
    }
  };

  const closeChat = async (onClosed: () => void) => {
    try {
      if (!conversationIdRef.current) return;

      await closeChatApi(conversationIdRef.current);

      setIsConnected(false);
      setIsTyping(false);
      setCurrentAgent(null);
      setMessages([]);
      setIsLoading(false);
      setError(null);
      onClosed();
    } catch (err) {
      console.error("Failed to close chat:", err);
      setError("Failed to close chat");
    }
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    startChat();

    return () => {
      const eventSource = eventSourceRef.current;
      if (eventSource) {
        eventSource.removeEventListener("message", handleIncomingEvent);
        eventSource.close();
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startChat, handleIncomingEvent]);

  return {
    messages,
    isConnected,
    isLoading,
    isTyping,
    currentAgent,
    error,
    sendMessage,
    closeChat,
    startNewChat: startChat,
  };
}
