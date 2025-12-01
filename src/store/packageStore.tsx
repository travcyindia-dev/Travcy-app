// src/store/usePackageStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Package {
  id: string;
  title: string;
  destination: string;
  duration: number;
  price: number;
  maxTravellers: number;
  description?: string;
  imgUrl?: string;
  rating?: number;
  [key: string]: any; // extra fields if needed
}

interface PackageState {
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  addPackage: (pkg: Package) => void;
  updatePackage: (id: string, data: Partial<Package>) => void;
  removePackage: (id: string) => void;
  reset:()=>void;
}

export const usePackageStore = create<PackageState>()(persist(
  (set) => ({
  packages: [],
  setPackages: (packages) => set({ packages }),
  addPackage: (pkg) => set((state) => ({ packages: [...state.packages, pkg] })),
  updatePackage: (id, data) =>
    set((state) => ({
      packages: state.packages.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removePackage: (id) =>
    set((state) => ({ packages: state.packages.filter((p) => p.id !== id) })),
  reset:()=>set({packages:[]})
}),
{
  name:"package-store"
}
));
