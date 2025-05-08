import { createContext, useContext } from "react";
import { Theme, ThemeConfig } from "../types";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const themeConfig: ThemeConfig = {
  dark: {
    primary: "bg-black",
    primaryHover: "hover:bg-gray-800",
    primaryText: "text-white",
    secondary: "bg-gray-700",
    secondaryHover: "hover:bg-gray-600",
    secondaryText: "text-gray-300",
    border: "border-gray-700",
    inputBg: "bg-gray-800",
    inputText: "text-gray-100",
    containerBg: "bg-gray-900",
    containerBorder: "border-gray-700",
    iconColor: "text-gray-400",
    iconColorMuted: "text-gray-500 opacity-50",
    buttonDisabledBg: "bg-gray-700",
    buttonDisabledText: "text-gray-500",
    messageMetaText: "text-gray-500",
    loadingDotColor: "bg-gray-500",
    fontSizes: {
      caption: "text-sm",
      bodySmall: "text-sm sm:text-base",
      body: "text-base sm:text-lg",
      heading: "text-lg sm:text-xl",
      title: "text-xl sm:text-2xl",
    },
    messageBubble: {
      user: {
        styles: "bg-black text-gray-300 border border-transparent",
        link: "text-teal-300",
        linkHover: "hover:text-teal-200",
        codeBg: "bg-gray-700",
        codeText: "text-gray-300",
        preBg: "bg-gray-700",
        preText: "text-gray-300",
      },
      ai: {
        styles: "text-gray-800 border border-gray-200",
        bg: "bg-gray-100",
        link: "text-teal-600",
        linkHover: "hover:text-teal-800",
        codeBg: "bg-gray-200",
        codeText: "text-gray-800",
        preBg: "bg-gray-200",
        preText: "text-gray-800",
      },
      system: {
        styles: "text-slate-700 border border-gray-200",
        bg: "bg-slate-200",
      },
    },
  },
  light: {
    primary: "bg-teal-600",
    primaryHover: "hover:bg-teal-700",
    primaryText: "text-white",
    secondary: "bg-teal-50",
    secondaryHover: "hover:bg-teal-100",
    secondaryText: "text-teal-900",
    border: "border-teal-100",
    inputBg: "bg-white",
    inputText: "text-gray-800",
    containerBg: "bg-white",
    containerBorder: "border-gray-200",
    iconColor: "text-gray-500",
    iconColorMuted: "text-gray-400 opacity-50",
    buttonDisabledBg: "bg-gray-100",
    buttonDisabledText: "text-gray-400",
    messageMetaText: "text-gray-500",
    loadingDotColor: "bg-gray-400",
    fontSizes: {
      caption: "text-sm",
      bodySmall: "text-sm sm:text-base",
      body: "text-base sm:text-lg",
      heading: "text-lg sm:text-xl",
      title: "text-xl sm:text-2xl",
    },
    messageBubble: {
      user: {
        styles: "bg-teal-600 text-white border border-teal-500",
        link: "text-teal-100",
        linkHover: "hover:text-teal-50",
        codeBg: "bg-teal-700",
        codeText: "text-teal-50",
        preBg: "bg-teal-700",
        preText: "text-teal-50",
      },
      ai: {
        styles: "text-gray-800 border border-gray-200",
        bg: "bg-gray-100",
        link: "text-teal-600",
        linkHover: "hover:text-teal-800",
        codeBg: "bg-gray-200",
        codeText: "text-gray-800",
        preBg: "bg-gray-200",
        preText: "text-gray-800",
      },
      system: {
        styles: "text-slate-700 border border-gray-200",
        bg: "bg-slate-200",
      },
    },
  },
} as const;
