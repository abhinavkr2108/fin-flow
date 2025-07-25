import { create } from "zustand";

interface CryptoState {
  selectedCrypto: string;
  setSelectedCrypto: (crypto: string) => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  selectedCrypto: "bitcoin",
  setSelectedCrypto: (crypto) => set({ selectedCrypto: crypto }),
}));
