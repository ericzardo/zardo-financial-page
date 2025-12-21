import { createContext, useContext, useState, ReactNode } from "react";

interface PrivacyContextType {
  isPrivacyEnabled: boolean;
  togglePrivacy: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [isPrivacyEnabled, setIsValuesHidden] = useState(false);

  const togglePrivacy = () => {
    setIsValuesHidden((prev) => !prev);
  };

  return (
    <PrivacyContext.Provider value={{ isPrivacyEnabled, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
}