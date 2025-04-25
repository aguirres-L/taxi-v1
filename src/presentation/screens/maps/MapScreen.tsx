/* 
        ya esta el mapa solo queda renderizarlo en el hombre y poder colocar las ubicaciones que yo quiera 
        

*/


import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, Linking, Text, Pressable } from 'react-native';
import { globalColors } from '../../theme/theme';
import { FormOfLocation } from '../../../components/mpas/FormOfLocation';
import { useNavigation } from '@react-navigation/core';
import { usePermissionStore } from '../../store/permission/usePermissionStore';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocationStore } from '../../store/location/location';
import { decodePolyline } from '../../../hooks/DecodePolyline';

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





export const MapScreen = () => {
    const mapRef = useRef<MapView>(null);
    const navigation = useNavigation();
    const { 
      locationStatus, 
      locationServicesEnabled,
      requestLocationPermission,
      checkLocationPermission,
      checkLocationServices
    } = usePermissionStore();
  
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
  

    const isAnimating = useRef(false);


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
      if (userLocation && destination) {
        fetchRoute(userLocation.coords, destination);
        // Animar primero hacia el origen
        mapRef.current?.animateToRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
        if(!destination.latitude) return
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
    if(routeCoordinates.length > 1) {
      distance = computeDistance(routeCoordinates); // en km
      estimatedTime = (distance / 40) * 60; // asumiendo 40 km/h, en minutos
      estimatedPrice = distance * 1.5; // tarifa de $1.5 por km
    }
  
    return (
      <View style={styles.mapContainer}>
        <View style={styles.new}>
          <FormOfLocation 
            onDestinationSelected={(coords, address) => setDestination({ ...coords, address })}
            onFocus={() => {
              if(userLocation) {
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
          {destination && routeCoordinates.length > 0 &&   (
            <Marker
              coordinate={destination}
              title="Destino"
              pinColor="blue"
            />
          )}
          {/* Ruta */}
          {destination && routeCoordinates.length > 0 &&   (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#000"
              strokeWidth={3}
            />
          )}
        </MapView>
        {/* UI de datos del viaje */}
        {destination && routeCoordinates.length > 1 && (
          <View style={styles.tripDetails}>
            <Text style={styles.tripText}>Distancia: {distance.toFixed(2)} km</Text>
            <Text style={styles.tripText}>Tiempo estimado: {estimatedTime.toFixed(0)} min</Text>
            <Text style={styles.tripText}>Precio: ${estimatedPrice.toFixed(2)}</Text>
            <Pressable>
              <Text style={styles.confirmTrip}>Confirmar viaje</Text>
            </Pressable>
          </View>
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
    tripDetails: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
    },
    tripText: {
      fontSize: 16,
      color: globalColors.taxiBlack,
      marginBottom: 5,
    },
    confirmTrip: {
      marginTop: 10,
      fontSize: 18,
      color: globalColors.taxiDarkYellow,
      fontWeight: 'bold',
      textAlign: 'center',
    },

});



/* 

 POR HACER 
- [ ] Hacer que el se muestre boton para confirmar el viaje y que se muestre el precio y el tiempo estimado de llegada
- [x] poder eliminar la ubicacion de destino y que se muestre el mapa sin la ruta en el formulario de ubicacion
- [ ] crear ui para mostrar los autos disponibles y el tiempo estimado de llegada del auto a la ubicacion del usuario
- [ ] crear ui para mostrar la ruta del auto al destino y el tiempo estimado de llegada del auto al destino
- [ ] crear ui para mostrar el precio del viaje y el tiempo estimado de llegada al destino
- [ ] crear ui para mostrar el nombre del conductor y la foto del conductor
- [ ] crear ui para mostrar el nombre del auto y la foto del auto
- [ ] crear ui para mostrar el numero de placa del auto y el color del auto

/*  */