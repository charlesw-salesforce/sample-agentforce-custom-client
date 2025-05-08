import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export const ChatErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = () => setHasError(true);
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 text-red-800 bg-red-50 rounded">
        <h3 className="font-medium">Something went wrong</h3>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Refresh widget
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
