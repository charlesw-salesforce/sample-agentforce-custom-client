import React, { useState } from "react";
import { Theme } from "../types"; // Assuming Theme type is defined here
import { ThemeContext } from "../hooks/useTheme"; // Import context from the hook file

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Basic theme state - the original likely had more logic (localStorage, etc.)
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
