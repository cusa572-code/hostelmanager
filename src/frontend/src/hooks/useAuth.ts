import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Identity } from "@icp-sdk/core/agent";

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  identity: Identity | undefined;
  principal: string | null;
  login: () => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const principal = identity ? identity.getPrincipal().toText() : null;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    principal,
    login,
    logout: clear,
  };
}
