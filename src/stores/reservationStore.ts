import { create } from "zustand";

interface ReservationStoreType {
  selectedReservationId: string;
  setSelectedReservationId: (reservationId: string) => void;
}

export const useReservationStore = create<ReservationStoreType>((set) => ({
  selectedReservationId: "",
  setSelectedReservationId: (reservationId) =>
    set({ selectedReservationId: reservationId }),
}));
