import React from "react";
import { ChatWindow, ChatErrorBoundary } from "./components/chat";
import ThemeProvider from "./contexts/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen">
        <ChatErrorBoundary>
          <ChatWindow agentRole="AI Concierge" onClose={() => {}} />
        </ChatErrorBoundary>
      </div>
    </ThemeProvider>
  );
};

export default App;
