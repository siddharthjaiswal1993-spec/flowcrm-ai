import { createContext, useContext, useState, type ReactNode } from "react";

type State = {
  accepted: boolean;
  accept: () => void;
  reset: () => void;
};

const Ctx = createContext<State | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <Ctx.Provider
      value={{
        accepted,
        accept: () => setAccepted(true),
        reset: () => setAccepted(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFlow() {
  const v = useContext(Ctx);
  if (!v) throw new Error("FlowProvider missing");
  return v;
}

export function metrics(accepted: boolean) {
  return {
    adoption: 18,
    wau: 42,
    wauTotal: 230,
    avgUpdate: 11,
    shadow: 63,
    csat: 2.1,
    stale: 61,
    missingNext: accepted ? 47 : 48,
    duplicates: 17,
    dataQuality: accepted ? 55 : 54,
    forecast: 41,
    pending: accepted ? 22 : 23,
    timeSaved: accepted ? 18.7 : 18.5,
    acceptanceRate: 72,
    autoFilled: "6 of 8",
  };
}