import React, { useState } from "react";
import { Send, Mic } from "lucide-react";
import { useSpeechRecognition, useTheme, themeConfig } from "../../hooks";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isEnabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isEnabled }) => {
  const [inputValue, setInputValue] = useState("");
  const { theme } = useTheme();
  const styles = themeConfig[theme];

  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    onTranscript: setInputValue,
    onFinalTranscript: async () => {
      if (inputValue.trim()) {
        await handleSend();
      }
    },
  });

  const handleSend = async () => {
    if (!inputValue.trim() || !isEnabled) return;
    await onSend(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`border-t ${styles.containerBorder} p-2 sm:p-3`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end space-y-2 sm:space-y-0 sm:space-x-3">
        <div
          className={`flex-1 ${styles.inputBg} rounded-lg border ${styles.border} border-opacity-0 transition-all duration-200 ${isEnabled ? `hover:border-opacity-100` : "opacity-50"}`}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isEnabled
                ? isListening
                  ? "Listening..."
                  : "Type your message..."
                : "Connecting..."
            }
            className={`w-full p-3 bg-transparent resize-none focus:outline-none ${styles.fontSizes.bodySmall} ${styles.inputText}`}
            rows={1}
            style={{ minHeight: "44px", maxHeight: "200px" }}
            disabled={!isEnabled}
            aria-label="Chat message input"
          />
          <div className="flex justify-between items-center px-2 sm:px-3 pb-2 sm:pb-3">
            <div>
              <button
                onClick={toggleListening}
                disabled={!isEnabled || !isSupported}
                className={`relative p-1 ${styles.secondaryHover} rounded-full transition-all duration-300`}
                aria-label="Toggle speech recognition"
              >
                {isListening && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-50" />
                )}
                <Mic
                  className={`relative w-4 h-4 ${isListening ? "text-red-500" : styles.iconColor}`}
                />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || !isEnabled}
              className={`p-3 rounded-full transition-colors duration-200 ${
                inputValue.trim() && isEnabled
                  ? `${styles.primary} ${styles.primaryText} ${styles.primaryHover}`
                  : `${styles.buttonDisabledBg} ${styles.buttonDisabledText}`
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
