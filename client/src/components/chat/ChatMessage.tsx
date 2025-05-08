import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThumbsUp, ThumbsDown, Info } from "lucide-react";
import { Message, ThemeStyles } from "../../types";
import { useTheme, themeConfig } from "../../hooks";

const formatTimestamp = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const markdownComponents = (type: "user" | "ai", styles: ThemeStyles) => {
  const bubbleStyles =
    type === "user" ? styles.messageBubble.user : styles.messageBubble.ai;

  return {
    a: ({ ...props }) => (
      <a
        {...props}
        className={`${bubbleStyles.link} ${bubbleStyles.linkHover} underline`}
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    code: ({ ...props }) => (
      <code
        {...props}
        className={`${bubbleStyles.codeBg} ${bubbleStyles.codeText} rounded px-1 py-0.5 ${styles.fontSizes.caption}`}
      />
    ),
    pre: ({ ...props }) => (
      <pre
        {...props}
        className={`${bubbleStyles.preBg} ${bubbleStyles.preText} rounded p-2 ${styles.fontSizes.caption} overflow-x-auto`}
      />
    ),
  };
};

export const ChatMessage: React.FC<Message> = ({
  type,
  content,
  timestamp,
}) => {
  const { theme } = useTheme();
  const styles = themeConfig[theme];

  if (type === "system") {
    const systemBubble = styles.messageBubble.system;
    return (
      <div className="flex justify-center my-2">
        <div
          className={`
          animate-fade-in animate-duration-300 
          flex items-center gap-2 px-3 py-1.5 
          rounded-full ${styles.fontSizes.caption} max-w-[85%] sm:max-w-md
          ${systemBubble.styles} ${systemBubble.bg}
        `}
        >
          <Info className="w-3 h-3" />
          <span>{content}</span>
        </div>
      </div>
    );
  }

  const isUser = type === "user";
  const alignClass = isUser ? "justify-end" : "justify-start";

  let bubbleClasses: string;
  if (isUser) {
    const userBubble = styles.messageBubble.user;
    bubbleClasses = userBubble.styles;
  } else {
    const aiBubble = styles.messageBubble.ai;
    bubbleClasses = `${aiBubble.styles} ${aiBubble.bg}`;
  }

  const metaTextStyle = isUser ? "" : styles.messageMetaText;

  return (
    <div className={`flex ${alignClass}`}>
      <div
        className={`
        max-w-[85%] sm:max-w-md rounded-lg p-2 sm:p-3
        transition-all duration-300 ease-out
        ${bubbleClasses}
      `}
      >
        <div
          className={`prose-sm max-w-full ${styles.fontSizes.bodySmall} break-words`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents(type, styles)}
          >
            {content}
          </ReactMarkdown>
        </div>
        <div className="mt-2 flex justify-end items-center space-x-2">
          <span className={`${styles.fontSizes.caption} ${metaTextStyle}`}>
            {formatTimestamp(timestamp)}
          </span>
          {type === "ai" && (
            <div className="flex space-x-1">
              <button className={`p-1 ${styles.secondaryHover} rounded-full`}>
                <ThumbsUp className={`w-3 h-3 ${styles.iconColorMuted}`} />
              </button>
              <button className={`p-1 ${styles.secondaryHover} rounded-full`}>
                <ThumbsDown className={`w-3 h-3 ${styles.iconColorMuted}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
