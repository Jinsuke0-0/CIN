"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDisconnect } from "wagmi";

type AuthContextType = {
  account: string | null;
  login: (address: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/analytics",
  "/notes",
  "/defi",
  "/faucet",
  "/official-events",
  "/opennote",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setAccount(storedAddress);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!account && isProtectedRoute) {
      router.replace("/");
    }
  }, [account, loading, pathname, router]);

  const login = (address: string) => {
    setAccount(address);
    localStorage.setItem("walletAddress", address);
    router.push("/dashboard");
  };

  const logout = () => {
    disconnect();
    setAccount(null);
    localStorage.removeItem("walletAddress");
    router.push("/");
  };

  const value = { account, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}