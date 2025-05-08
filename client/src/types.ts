export interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}

export interface Entry {
  operation: string;
  menuMetadata: object;
  participant: Participant;
  displayName: string;
}

export interface Participant {
  role: string;
  appType: string;
  subject: string;
  clientIdentifier: string;
}

export type Theme = "light" | "dark";

// Define the structure for message bubble styles
export interface MessageBubbleStyles {
  styles: string; // Base classes for the bubble
  link?: string;
  linkHover?: string;
  codeBg?: string;
  codeText?: string;
  preBg?: string;
  preText?: string;
}

export interface AiSystemMessageBubbleStyles extends MessageBubbleStyles {
  bg: string;
}

export interface ThemeStyles {
  primary: string;
  primaryHover: string;
  primaryText: string;
  secondary: string;
  secondaryHover: string;
  secondaryText: string;
  border: string;
  inputBg: string;
  inputText: string;
  containerBg: string;
  containerBorder: string;
  iconColor: string;
  iconColorMuted: string;
  buttonDisabledBg: string;
  buttonDisabledText: string;
  messageMetaText: string;
  loadingDotColor: string;
  fontSizes: {
    caption: string;
    bodySmall: string;
    body: string;
    heading: string;
    title: string;
  };
  messageBubble: {
    user: MessageBubbleStyles;
    ai: AiSystemMessageBubbleStyles;
    system: AiSystemMessageBubbleStyles;
  };
}

// Define the main ThemeConfig type
export type ThemeConfig = Record<Theme, ThemeStyles>;
