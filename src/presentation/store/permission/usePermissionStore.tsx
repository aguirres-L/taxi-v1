// store/permission/usePermissionStore.ts
import { create } from 'zustand';
import * as Location from 'expo-location';
import { Linking, Alert } from 'react-native';

type PermissionStatusType = 'granted' | 'denied' | 'undetermined' | 'blocked';

interface PermissionState {
    locationStatus: PermissionStatusType;
    locationServicesEnabled: boolean;
    requestLocationPermission: () => Promise<void>;
    checkLocationPermission: () => Promise<void>;
    checkLocationServices: () => Promise<void>;
}

export const usePermissionStore = create<PermissionState>((set) => ({
    locationStatus: 'undetermined', // Estado inicial
    locationServicesEnabled: false, // Nuevo estado para servicios de ubicación

    // Función para solicitar permisos
    requestLocationPermission: async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        set({ locationStatus: status as PermissionStatusType });
        console.log('requestLocationPermission in ui usePermissionStore', status);

    },
    
    // Función para verificar permisos (sin solicitar)
    checkLocationPermission: async () => {
        const { status } = await Location.getForegroundPermissionsAsync();
      //  console.log('checkLocationPermission in ui usePermissionStore', status);
        
        set({ locationStatus: status as PermissionStatusType });
    },
    
    // Función para verificar y solicitar la activación de servicios de ubicación
    checkLocationServices: async () => {
        const enabled = await Location.hasServicesEnabledAsync();
        
        set({ locationServicesEnabled: enabled });
        console.log(enabled, 'valor de gps en usePermissionStore');
         
    },
}));