
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';


import { globalColors } from '../../theme/theme';
import { FormOfLocation } from '../../../components/mpas/FormOfLocation';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocationStore } from '../../store/location/location';
import { decodePolyline } from '../../../hooks/DecodePolyline';
import { DestinoMarker } from '../../../components/mpas/Marker/DestinoMarker';
import { TaxiMarker } from '../../../components/mpas/Marker/TaxiMarker';
import { ConfirmTrip } from '../../../components/mpas/ui/ConfirmTrip';
import { LookingForADriverComponent } from '../../../components/mpas/ui/LookingForADriverComponent';
import { DriverMarker } from '../../../components/mpas/Marker/DriverMarker';
import { DriverFoundComponent } from '../../../components/mpas/ui/DriverFoundComponent ';

// Función para decodificar la polyline
/* const decodePolyline = (encoded: string) => {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: { latitude: number; longitude: number }[] = [];

    while (index < encoded.length) {
        let b;
        let shift = 0;
        let result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += dlng;
    
        coordinates.push({ latitude: lat * 1e-5, longitude: lng * 1e-5 });
    }
    return coordinates;
};
 */
// Helper para calcular distancia total (en km) usando la fórmula de haversine
const computeDistance = (coords: { latitude: number; longitude: number }[]) => {
  let total = 0;
  const toRad = (value: number) => (value * Math.PI) / 180;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(curr.latitude - prev.latitude);
    const dLon = toRad(curr.longitude - prev.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(prev.latitude)) *
      Math.cos(toRad(curr.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return total;
};


// Función para calcular una región que abarque todas las coordenadas
const computeRegion = (coordinates: { latitude: number; longitude: number }[]) => {
  // Obtener los valores mínimos y máximos de latitud y longitud
  const latitudes = coordinates.map(coord => coord.latitude);
  const longitudes = coordinates.map(coord => coord.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  // Calcula el centro y agrega un factor de padding para que no queden muy pegados
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;

  // Si la ruta es muy corta, se puede establecer un mínimo para el delta
  const paddingFactor = 1.5;
  const minDelta = 0.01;
  const latitudeDelta = Math.max((maxLat - minLat) * paddingFactor, minDelta);
  const longitudeDelta = Math.max((maxLng - minLng) * paddingFactor, minDelta);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
};


// En tu MapScreen.tsx
const generateNearbyTaxis = (userLocation: Location.LocationObject) => {
  const taxis = [];
  const count = 5; // Número de taxis a generar
  const radius = 0.02; // Radio en grados (aprox. 2km)

  for (let i = 0; i < count; i++) {
    // Generar desplazamientos aleatorios dentro del radio
    const latOffset = (Math.random() - 0.5) * radius;
    const lngOffset = (Math.random() - 0.5) * radius;

    taxis.push({
      id: `taxi_${i}`,
      latitude: userLocation.coords.latitude + latOffset,
      longitude: userLocation.coords.longitude + lngOffset,
      heading: Math.random() * 360, // Dirección aleatoria
      available: Math.random() > 0.3, // 70% de probabilidad de estar disponible
    });
  }
  return taxis;
};


// Crea el componente Animated para Polyline
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);


export const MapScreen = () => {
  const mapRef = useRef<MapView>(null);

  const [taxis, setTaxis] = useState<any[]>([]);

  // Agrega esto junto con tus otros estados
  const [driverFound, setDriverFound] = useState<any>(null);
  //  Looking for a driver
  const [lookingForADriver, setLookingForADriver] = useState<boolean>(false);

  const [scaleValue, setScaleValue] = useState(0);


  // Nuevo estado para la ruta del chofer
  const [driverRouteCoordinates, setDriverRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  // Variable de animación para dashOffset
  const dashAnimation = useRef(new Animated.Value(0)).current;

  // Usa el store de ubicación
  const {
    userLocation,
    destination,
    routeCoordinates,
    setUserLocation,
    setDestination,
    setRouteCoordinates,
    fetchUserLocation,
  } = useLocationStore();


  // NUEVO: Animar el mapa a la ubicación del usuario si está disponible y no hay destino
  useEffect(() => {
    if (userLocation && !destination) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }

  }, [userLocation, destination]);




  useEffect(() => {
    if (userLocation) {
      const nearbyTaxis = generateNearbyTaxis(userLocation);
      setTaxis(nearbyTaxis);
    }
  }, [userLocation]);


  useEffect(() => {
    if (userLocation && destination) {
      fetchRoute(userLocation.coords, destination);
      // Animar primero hacia el origen
      mapRef.current?.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
      if (!destination.latitude) return
      // Luego, tras breve retraso, animar con zoom al destino
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }, 1900);
      // Finalmente, tras otro retraso, ajustar el zoom de forma dinámica según la ruta
      setTimeout(() => {
        const coordsArray = routeCoordinates.length > 0
          ? routeCoordinates
          : [userLocation.coords, destination];
        const region = computeRegion(coordsArray);
        mapRef.current?.animateToRegion(region, 1000);
      }, 3500);
    }
  }, [userLocation, destination]);

  /* . Simular Movimiento de Taxis */


  useEffect(() => {
    if (taxis.length === 0) return;

    const moveInterval = setInterval(() => {
      setTaxis(prevTaxis =>
        prevTaxis.map(taxi => {
          // Mover cada taxi en su dirección actual
          const speed = 0.0001; // Velocidad de movimiento (ajustable)
          const rad = (taxi.heading * Math.PI) / 180;
          return {
            ...taxi,
            latitude: taxi.latitude + Math.cos(rad) * speed,
            longitude: taxi.longitude + Math.sin(rad) * speed,
            heading: taxi.heading + (Math.random() * 10 - 5), // Pequeño cambio de dirección
          };
        })
      );
    }, 2500); // Actualizar cada segundo

    return () => clearInterval(moveInterval);
  }, [taxis]);




  useEffect(() => {
    const interval = setInterval(() => {
      setScaleValue(prev => {
        if (prev >= 9) return -1;
        return prev + 1;
      });
    }, 60); // Ajusta este valor para cambiar la velocidad

    return () => clearInterval(interval);
  }, []);



  // Modifica tu useEffect para simular encontrar un chofer
  useEffect(() => {
    if (lookingForADriver && !driverFound && userLocation) {
      // Simulamos que encontramos un chofer después de 5 segundos
      const timer = setTimeout(() => {
        const foundDriver = {
          id: 'driver123',
          name: 'Juan',
          lastName: 'Pérez',
          phone: '+1234567890',
          licensePlate: 'ABC123',
          taxiNumber: 'TAXI456',
          rating: 4.8,
          carModel: 'Toyota Corolla',
          position: {
            latitude: userLocation?.coords.latitude! + 0.005,
            longitude: userLocation?.coords.longitude! + 0.005,
          },
          heading: 45
        };
        setDriverFound(foundDriver);

        // Mover el mapa hacia la posición del chofer
        mapRef.current?.animateToRegion({
          latitude: userLocation?.coords.latitude! + 0.005,
          longitude: userLocation?.coords.longitude! + 0.005,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);

      }, 5000);

         // Finalmente, tras otro retraso, ajustar el zoom de forma dinámica según la ruta
      /*    setTimeout(() => {
          const coordsArray = routeCoordinates.length > 0
            ? routeCoordinates
            : [userLocation.coords, destination];
          const region = computeRegion(coordsArray);
          mapRef.current?.animateToRegion(region, 1000);
        }, 3500); */

      console.log(userLocation,'userLocation');
      console.log(routeCoordinates[0],'routeCoordinates in useEffect');
      

      return () => clearTimeout(timer);
    }
  }, [lookingForADriver, driverFound, userLocation]);


   // useEffect para obtener la ruta del chofer al usuario cuando ambos estén disponibles
   useEffect(() => {
    if (driverFound && userLocation) {
      fetchDriverRoute(driverFound.position, userLocation.coords);
      console.log(driverRouteCoordinates,'driverRouteCoordinates in useEffect');

    }
  }, [driverFound, userLocation]);


  // Efecto para ajustar el zoom y ver completa la ruta (chofer->usuario y usuario->destino)
useEffect(() => {
  if (driverFound && driverRouteCoordinates.length > 0 && destination && routeCoordinates.length > 0) {
    // Ajusta el delay según prefieras que se ejecute después de la animación hacia el chofer
    setTimeout(() => {
      const combinedCoords = [...driverRouteCoordinates, ...routeCoordinates];
      const region = computeRegion(combinedCoords);
      mapRef.current?.animateToRegion(region, 5000);
    }, 3500);
  }
}, [driverFound, driverRouteCoordinates, destination, routeCoordinates]);



  /*  useefft animation ruta user from destino  */

  useEffect(() => {
    Animated.loop(
      Animated.timing(dashAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  // Convertimos el valor 0-9 a una escala 0.8-1.5
  const scale = 0.8 + (scaleValue * 0.07);

  // Función para obtener la ruta (puedes moverla al store si lo prefieres)
  const fetchRoute = async (origin: { latitude: number; longitude: number }, dest: { latitude: number; longitude: number }) => {
    const API_KEY = 'AIzaSyCSimFXop4MKU50o4fQJY1-5W1SnpiAWMo';
    const originParam = `${origin.latitude},${origin.longitude}`;
    const destParam = `${dest.latitude},${dest.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originParam}&destination=${destParam}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length) {
        const points = data.routes[0].overview_polyline.points;
        const coords = decodePolyline(points);
        setRouteCoordinates(coords);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Calcular datos de la ruta si existen coordenadas
  let distance = 0;
  let estimatedTime = 0;
  let estimatedPrice = 0;
  if (routeCoordinates.length > 1) {
    distance = computeDistance(routeCoordinates); // en km
    estimatedTime = (distance / 40) * 60; // asumiendo 40 km/h, en minutos
    estimatedPrice = distance * 918; // tarifa de $1.5 por km  ------   COLOCAR TARIFA NOCTURNA
  }




  // cancelar busqueda de chofer

  const cancelSearch = () => {
    setLookingForADriver(false)
  }




  // funcion para ruta de chofer a usuario 

  // Función para obtener la ruta usando la API de Google (similar a fetchRoute)
  const fetchDriverRoute = async (
    origin: { latitude: number; longitude: number },
    dest: { latitude: number; longitude: number }
  ) => {
    const API_KEY = 'AIzaSyCSimFXop4MKU50o4fQJY1-5W1SnpiAWMo';
    const originParam = `${origin.latitude},${origin.longitude}`;
    const destParam = `${dest.latitude},${dest.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originParam}&destination=${destParam}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length) {
        const points = data.routes[0].overview_polyline.points;
        const coords = decodePolyline(points);
        setDriverRouteCoordinates(coords);
      }
    } catch (error) {
      console.error("Error fetching driver route:", error);
    }
  };

  return (
    <View style={styles.mapContainer}>
      <View style={styles.new}>
        <FormOfLocation
          onDestinationSelected={(coords, address) => setDestination({ ...coords, address })}
          onFocus={() => {
            if (userLocation) {
              mapRef.current?.animateToRegion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
            }
          }}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          userLocation ? {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          } : undefined
        }
        showsUserLocation={true}
      >

        {/* Marcador de destino */}
        {destination && <DestinoMarker destination={destination} routeCoordinates={routeCoordinates} />}


        {/* Marcadores de taxis */}
        {destination?.address && !driverFound && <TaxiMarker destinationAddres={{ address: destination.address }} taxis={taxis} />}

        {/* Ruta */}
        {destination &&  routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}




   {/* Ruta del chofer al usuario */}
   {driverFound && destination && driverRouteCoordinates.length > 0 && (
          <Polyline
            coordinates={driverRouteCoordinates}
            strokeColor= {globalColors.taxiDarkYellow}
            strokeWidth={3}
          />
        )}

        {/* Marcador del chofer encontrado */}
        {driverFound && destination?.address && (
          <DriverMarker driver={driverFound} />
        )}

   

      </MapView>

{/* UI de datos del viaje */}
{destination && routeCoordinates.length > 1 && (
  <>
    {!lookingForADriver && distance && estimatedTime && estimatedPrice && (
      <ConfirmTrip 
        distance={distance} 
        estimatedTime={estimatedTime} 
        estimatedPrice={estimatedPrice} 
        setLookingForADriver={setLookingForADriver} 
      />
    )}
    
    {lookingForADriver && !driverFound && (
      <LookingForADriverComponent  
        cancelSearch={cancelSearch} 
        scale={scale} 
        estimatedTime={estimatedTime} 
      />
    )}
    
    {driverFound && (
      <DriverFoundComponent 
        driver={driverFound} 
        onCancel={() => {
          setDriverFound(null);
          setLookingForADriver(false);
        }} 
      />
    )}
  </>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: globalColors.mediumGray,
    position: 'relative',
    overflow: 'hidden',
  },
  new: {
    width: '100%',
    top: 20,
    position: 'absolute',
    zIndex: 1,
  },

  driverRouteAnimation: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4a90e2',
    flexShrink: 1,  // Permite que el contenedor se ajuste al texto
    minWidth: 150,   // Ancho mínimo garantizado
  },
  driverRouteText: {
    color: '#4a90e2',
    fontWeight: 'bold',
    flexShrink: 1,  // Permite que el texto se ajuste
    textAlign: 'center',  // Centra el texto
  },
});



/* 

 POR HACER 
- [x] Hacer que el se muestre boton para confirmar el viaje y que se muestre el precio y el tiempo estimado de llegada
- [x] poder eliminar la ubicacion de destino y que se muestre el mapa sin la ruta en el formulario de ubicacion
- [] crear ui para mostrar los autos disponibles y el tiempo estimado de llegada del auto a la ubicacion del usuario
- [] crear ui para mostrar la ruta del auto al destino y el tiempo estimado de llegada del auto al destino
- [x] crear ui para mostrar el precio del viaje y el tiempo estimado de llegada al destino
- [] crear ui para mostrar el nombre del conductor y la foto del conductor
- [] crear ui para mostrar el nombre del auto y la foto del auto
- [] crear ui para mostrar el numero de placa del auto y el color del auto

 */