import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Prototype-wide flow state.
 *
 * The only mutable state in the prototype is whether the user has accepted
 * the AI suggestion for Acme Logistics. Every screen reads from this flag
 * to render its "before" or "after" copy/metrics.
 */

type FlowState = {
  accepted: boolean;
  accept: () => void;
  reset: () => void;
};

const FlowContext = createContext<FlowState | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <FlowContext.Provider
      value={{
        accepted,
        accept: () => setAccepted(true),
        reset: () => setAccepted(false),
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const v = useContext(FlowContext);
  if (!v) throw new Error("FlowProvider missing");
  return v;
}

/**
 * Derived dashboard metrics. Values shift slightly once the Acme Logistics
 * suggestion has been accepted to make the impact of one update visible.
 */
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