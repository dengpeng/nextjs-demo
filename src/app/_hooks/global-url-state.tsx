"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

type GlobalUrlState = {
  isPending: boolean;
  setIsPending: (value: boolean) => void;
};

const GlobalUrlStateContext = createContext<GlobalUrlState | undefined>(
  undefined,
);

export const GlobalUrlStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPending, setIsPending] = useState(false);

  return (
    <GlobalUrlStateContext.Provider value={{ isPending, setIsPending }}>
      {children}
    </GlobalUrlStateContext.Provider>
  );
};

export const useGlobalUrlState = () => {
  const context = useContext(GlobalUrlStateContext);
  if (context === undefined) {
    return [false, undefined] as const;
  }

  return [context.isPending, context.setIsPending] as const;
};
