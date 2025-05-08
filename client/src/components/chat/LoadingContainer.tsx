import React from "react";
// Import theme hooks and config
import { useTheme, themeConfig } from "../../hooks";

type DotSize = "small" | "medium";
type Alignment = "left" | "right";

interface LoadingDotsProps {
  size?: DotSize;
}

interface LoadingContainerProps {
  align?: Alignment;
}

const dotSizes: Record<DotSize, string> = {
  small: "w-2 h-2",
  medium: "w-3 h-3",
};

const LoadingDots: React.FC<LoadingDotsProps> = ({ size = "small" }) => {
  // Get theme styles for dot color
  const { theme } = useTheme();
  const styles = themeConfig[theme];

  return (
    <div className="flex space-x-2">
      {/* Use loadingDotColor */}
      <div
        className={`${dotSizes[size]} ${styles.loadingDotColor} rounded-full animate-bounce`}
      />
      <div
        className={`${dotSizes[size]} ${styles.loadingDotColor} rounded-full animate-bounce`}
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className={`${dotSizes[size]} ${styles.loadingDotColor} rounded-full animate-bounce`}
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  align = "left",
}) => {
  // Get theme styles for container background
  const { theme } = useTheme();
  const styles = themeConfig[theme];

  return (
    <div
      className={`
        flex ${align === "right" ? "justify-end" : "justify-start"}
      `}
    >
      {/* Use AI message bubble background color */}
      <div className={`${styles.messageBubble.ai.bg} rounded-lg p-3`}>
        <LoadingDots size="small" />
      </div>
    </div>
  );
};
