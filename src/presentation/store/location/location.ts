import { create } from 'zustand';
import * as Location from 'expo-location';

// Actualizamos el tipo Trip para incluir dirección de origen y destino
type Trip = {
  startCoordinates: { latitude: number; longitude: number };
  originAddress: string;
  destCoordinates: { latitude: number; longitude: number };
  destinationAddress: string;
  date?: string;
};
type TripLast = {
  lastTrip: Trip | null;
  setLastTrip: (trip: Trip) => void;
}



type LocationState = {
  // Ubicación actual del usuario (GPS)
  userLocation: Location.LocationObject | null;
  setUserLocation: (location: Location.LocationObject) => void;

  // Dirección de destino (seleccionada por el usuario)
  destination: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  setDestination: (coords: { latitude?: number; longitude?: number; address?: string }) => void;

  // Ruta entre origen y destino (coordenadas decodificadas)
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
  setRouteCoordinates: (coordinates: Array<{ latitude: number; longitude: number }>) => void;

  // Obtener la ubicación actual del usuario (con permisos)
  fetchUserLocation: () => Promise<void>;

  // NUEVO: Manejo de viajes recientes
  recentTrips: Trip[];
  setRecentTrips: (trips: Trip[]) => void;
  addRecentTrip: (trip: Trip) => void;
  simulateRecentTrips: () => void; // simula viajes recientes con datos de inicio y destino
};









// Store de Zustand para manejar la ubicación y los viajes recientes
export const useLocationStore = create<LocationState>((set) => ({
  userLocation: null,
  destination: null,
  routeCoordinates: [],
  recentTrips: [],



  setUserLocation: (location) => set({ userLocation: location }), 
  
  setDestination: (coords) => 
    set({ 
      destination: coords === null 
        ? null 
        : { 
            latitude: coords.latitude || 0, 
            longitude: coords.longitude || 0,
            address: coords.address 
          } 
    }),

  
  setRouteCoordinates: (coordinates) => set({ routeCoordinates: coordinates }),

  fetchUserLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log(location,'from location ubicacion user ');
      
      set({ userLocation: location });
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  },


  // NUEVO: Métodos para manejar los viajes recientes TENDRIA QUE ESTAR EN LA CARPETA ULTIMOS VIAJES

  setRecentTrips: (trips) => {

    const dummyTrips: Trip[] = [
      {
        startCoordinates: { latitude: -31.417, longitude: -64.183 },
        originAddress: "Nicolas de Avellaneda 2032, cordoba ",
        destCoordinates: { latitude: -31.500, longitude: -64.200 },
        destinationAddress: "suipacha 1468, Cordoba",
        date: new Date().toISOString()
      },
      {
        startCoordinates: { latitude: -32.946, longitude: -60.639 },
        originAddress: "Nicolas de Avellaneda 2032, cordoba ",
        destCoordinates: { latitude: -32.950, longitude: -60.640 },
        destinationAddress: "Graham Bell 2020, cordoba",
        date: new Date().toISOString()
      },
      {
        startCoordinates: { latitude: -31.550, longitude: -64.083 },
        originAddress: "Nicolas de Avellaneda 2032, cordoba ",
        destCoordinates: { latitude: -31.560, longitude: -64.090 },
        destinationAddress: "sucre 1468, Cordoba",
        date: new Date().toISOString()
      },
    ];
    set({ recentTrips: dummyTrips });
    console.log(trips, 'trips en setRecentTrips');
    console.log(dummyTrips, 'dummyTrips en setRecentTrips');

  },
  addRecentTrip: (trip) => set((state) => ({ recentTrips: [trip, ...state.recentTrips] })),
  simulateRecentTrips: () => {
    const dummyTrips: Trip[] = [
      {
        startCoordinates: { latitude: -31.417, longitude: -64.183 },
        originAddress: "Av. Siempre Viva 123, Cordoba",
        destCoordinates: { latitude: -31.500, longitude: -64.200 },
        destinationAddress: "sucre 1468, Cordoba",
        date: new Date().toISOString()
      },
      {
        startCoordinates: { latitude: -32.946, longitude: -60.639 },
        originAddress: "Calle Falsa 456, Cordoba",
        destCoordinates: { latitude: -32.950, longitude: -60.640 },
        destinationAddress: "sucre 1468, Cordoba",
        date: new Date().toISOString()
      },
      {
        startCoordinates: { latitude: -31.550, longitude: -64.083 },
        originAddress: "Ruta 66 789, Cordoba",
        destCoordinates: { latitude: -31.560, longitude: -64.090 },
        destinationAddress: "sucre 1468, Cordoba",
        date: new Date().toISOString()
      },
    ];
    set({ recentTrips: dummyTrips });
  },
}));