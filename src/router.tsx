import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { isAuthError } from "./components/feedback";

/**
 * Centralized handling for "your session expired" errors thrown by
 * `requireSupabaseAuth` middleware. Any query or mutation that fails with
 * an auth-shaped error pushes the user to /auth?reason=expired so we never
 * fall through to a generic root error boundary for normal session expiry.
 */
function handleGlobalError(err: unknown) {
  if (typeof window === "undefined") return;
  if (!isAuthError(err)) return;
  if (window.location.pathname === "/auth") return;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`/auth?reason=expired&redirect=${next}`);
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleGlobalError }),
    mutationCache: new MutationCache({ onError: handleGlobalError }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => !isAuthError(error) && failureCount < 1,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
