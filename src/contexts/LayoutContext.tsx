import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};