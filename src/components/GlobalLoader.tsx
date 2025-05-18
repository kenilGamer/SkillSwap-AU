"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoaderContextType {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  setLoading: () => {},
});

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function LoaderOverlay() {
  const { loading } = useLoader();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <span className="ml-4 text-xl font-bold text-blue-600">Loading...</span>
    </div>
  );
} 