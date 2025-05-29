"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoaderContextType {
  /* eslint-disable-next-line no-unused-vars */
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function LoaderOverlay() {
  const { isLoading } = useLoader();
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <span className="mt-4 text-xl font-bold text-blue-600">Loading...</span>
      </div>
    </div>
  );
}