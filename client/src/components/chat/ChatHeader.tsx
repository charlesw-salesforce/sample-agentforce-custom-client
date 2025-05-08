import { X, RefreshCw } from "lucide-react";
import { useTheme, themeConfig } from "../../hooks";

interface ChatHeaderProps {
  agentName: string | null;
  agentRole: string;
  isConnected: boolean;
  onClose: () => void;
  onStartNewChat: () => Promise<void>;
}

export const ChatHeader = ({
  agentName,
  agentRole,
  isConnected,
  onClose,
  onStartNewChat,
}: ChatHeaderProps) => {
  const { theme } = useTheme();
  const styles = themeConfig[theme];

  return (
    <div
      className={`${styles.primary} p-3 sm:p-4 flex justify-between items-center flex-shrink-0 transition-all duration-300`}
    >
      <div>
        {agentName === null ? (
          <div className="space-y-2">
            <div className="h-6 bg-white bg-opacity-20 rounded w-40 animate-pulse"></div>
            <p
              className={`${styles.fontSizes.bodySmall} ${styles.primaryText} opacity-75`}
            >
              {isConnected ? "Connecting with AI concierge..." : "Disconnected"}
            </p>
          </div>
        ) : (
          <>
            <h2
              className={`${styles.fontSizes.title} font-serif ${styles.primaryText}`}
            >
              {agentName}
            </h2>
            <p
              className={`text-xs sm:text-sm ${styles.primaryText} opacity-75`}
            >
              {agentRole}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onStartNewChat}
          className={`p-2 rounded-full ${styles.primaryText} hover:bg-white hover:bg-opacity-20 transition-colors duration-200`}
          title="Start new chat"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className={`p-2 rounded-full ${styles.primaryText} hover:bg-white hover:bg-opacity-20 transition-colors duration-200`}
          title="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
