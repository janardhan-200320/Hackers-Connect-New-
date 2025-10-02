import { createContext, useContext, useState, ReactNode } from 'react';

interface ChallengeContextType {
  isStartChallengeOpen: boolean;
  setIsStartChallengeOpen: (open: boolean) => void;
  openStartChallenge: () => void;
  closeStartChallenge: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [isStartChallengeOpen, setIsStartChallengeOpen] = useState(false);

  const openStartChallenge = () => setIsStartChallengeOpen(true);
  const closeStartChallenge = () => setIsStartChallengeOpen(false);

  return (
    <ChallengeContext.Provider
      value={{
        isStartChallengeOpen,
        setIsStartChallengeOpen,
        openStartChallenge,
        closeStartChallenge,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
}
