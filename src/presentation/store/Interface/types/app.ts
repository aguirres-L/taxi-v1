// Tipos para la ubicación
export type Location = {
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  // Tipos para el usuario
  export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  
  // Tipos para el viaje
  export type Trip = {
    id: string;
    startLocation: Location;
    endLocation: Location;
    status: 'searching' | 'in_progress' | 'completed';
  };