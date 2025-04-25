import { create } from 'zustand';
import { Trip, Location } from '../Interface/types/app';

type TripState = {
  activeTrip: Trip | null;
  tripHistory: Trip[];
  setActiveTrip: (trip: Trip | null) => void;
  updateTripDestination: (endLocation: Location) => void;
};

export const useTripStore = create<TripState>((set) => ({
  activeTrip: null,
  tripHistory: [],
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  updateTripDestination: (endLocation) =>
    set((state) => ({
      activeTrip: state.activeTrip 
        ? { ...state.activeTrip, endLocation } 
        : null,
    })),
}));