

// src/screens/LoadingScreen.tsx
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, Image, Linking, Alert } from 'react-native';
import { usePermissionStore } from '../../store/permission/usePermissionStore';
import { useLocationStore } from '../../store/location/location';

const LoadingScreen = () => {
  const navigation = useNavigation();
/* 
  useEffect(() => {
    const timer = setTimeout(() => {
    navigation.navigate('Home'as never );
    }, 2000); // 3 segundos de loading

    return () => clearTimeout(timer);
  }, [navigation]);
 */

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

console.log(userLocation,'userLocation loading screen');

      // Verificar permisos al cargar la pantalla
    useEffect(() => {

        checkLocationPermission();
        checkPermissions();
console.log(userLocation,'userLocation loading screen');

      }, []);


      useEffect(() => {
      async  function routerFromHome() {
        if (userLocation) {
            navigation.navigate('Home' as never);
        }
        }

        routerFromHome();
    }, [userLocation]);

      const checkPermissions = async () => {
        checkLocationServices();
    
        if (locationStatus === 'denied') {
          Alert.alert(
            "Permiso denegado",
            "Para usar esta función, necesitamos acceso a tu ubicación. ¿Quieres habilitarlo ahora?",
            [
              { text: "No", style: "cancel", onPress: () => navigation.navigate('Home' as never) },
              { text: "Sí", onPress: () => {
                requestLocationPermission();  
                Linking.openSettings();  
              } },
            ] 
          );
        }
    
        if (locationStatus === 'blocked') {
          await checkLocationPermission();
        }
    
        // Obtener ubicación actual usando el store
        await fetchUserLocation();
    
        if (!locationServicesEnabled && locationStatus !== 'denied' && locationStatus !== 'undetermined') {
          Alert.alert(
            'GPS desactivado',
            'Para usar esta función, necesitamos que el GPS esté activo. ¿Quieres habilitarlo?',
            [
              { text: 'No', style: 'cancel'/* , onPress: () => navigation.navigate('Home' as never) */ },
              { text: 'Sí', onPress: () => Linking.openSettings() }
            ],
            { cancelable: false }
          );
        }
      };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/new-logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#000000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700', // Amarillo taxi
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default LoadingScreen;