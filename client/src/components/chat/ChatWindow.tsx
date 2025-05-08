import React, { useRef, useEffect } from "react";
import { ChatInput, ChatHeader, ChatMessage, LoadingContainer } from "./index";
import { useChat, useTheme, themeConfig } from "../../hooks";
import { Message } from "../../types";

interface ChatWindowProps {
  onClose: () => void;
  agentRole: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onClose,
  agentRole,
}) => {
  const {
    messages,
    isConnected,
    isLoading,
    isTyping,
    currentAgent,
    error,
    sendMessage,
    startNewChat,
  } = useChat();

  const { theme } = useTheme();
  const styles = themeConfig[theme];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEffectivelyLoading = isLoading || isTyping;

  return (
    <div className={`h-full w-full flex flex-col ${styles.containerBg}`}>
      <ChatHeader
        agentName={currentAgent}
        agentRole={agentRole}
        onClose={onClose}
        isConnected={isConnected}
        onStartNewChat={startNewChat}
      />

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-800 p-3 text-sm">
            Failed to load messages. Please try again.
          </div>
        )}
        <>
          {messages.map((message: Message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          {isEffectivelyLoading && <LoadingContainer align="left" />}
          <div ref={messagesEndRef} />
        </>
      </div>

      <ChatInput onSend={sendMessage} isEnabled={isConnected} />
    </div>
  );
};
