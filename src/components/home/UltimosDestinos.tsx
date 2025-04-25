  import React, { useEffect, useState } from 'react';
  import { View, Text,  StyleSheet, Pressable } from 'react-native';
  import { globalColors, globalStyles } from '../../presentation/theme/theme';
  import { RecentDestinationsProps } from '../../presentation/store/Interface/types/RecentDestinatios';
  //import { LastDestinationSelected } from './LastDestinationSelectd';
  import { useLocationStore } from '../../presentation/store/location/location';
  import * as Location from 'expo-location'; // Asegúrate de tener expo-location instalado

  import { useNavigation } from '@react-navigation/native';
  import { decodePolyline } from '../../hooks/DecodePolyline';
  interface UltimosDestinosProps {
      recentDestinations?: RecentDestinationsProps[];
    }


  export const UltimosDestinos = ({ recentDestinations = [] }: UltimosDestinosProps) => {
    const [selectedDestination, setSelectedDestination] = useState<RecentDestinationsProps | null>(null);
    
    const [newRuter, setNewRuter] = useState<boolean | null>(null);

        const {
          userLocation,
          setDestination,
          setRouteCoordinates,
          destination
        } = useLocationStore();


    const navigation = useNavigation();

   //etchRoute(userLocation.coords, destination);  --- necesito pasarle los nuevos datos de cordenadas 
  
    
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



  // Efecto para obtener la ruta cuando cambia el destino
  // Efecto para obtener la ruta cuando cambia el destino
  useEffect(() => {
    if (userLocation && destination) {
      const { latitude, longitude } = destination;
      if (latitude && longitude) {
        fetchRoute(userLocation.coords, destination);
      }
    }
  }, [destination, userLocation]); // Añade destination como dependencia




    function slecetdLastDesine({ destination }: { destination: RecentDestinationsProps }){
      // Geocodificamos la dirección del destino
      
      Location.geocodeAsync(destination.destino)
        .then(results => {
          if(results && results.length > 0) {
            const first = results[0];
            const newCoords = { latitude: first.latitude, longitude: first.longitude };
            setDestination({ ...newCoords, address: destination.destino });
            setNewRuter(!newRuter)
            navigation.navigate('MapScreen' as never);

          } else {
            console.warn("No se encontraron coordenadas para el destino");
          }
        })
        .catch(error => {
          console.error("Error en geocodeAsync para destino", error);
        });
     
    }





    //if (destination) console.log('destino selectd ', destination)

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Últimos Destinos</Text>
        <View style={styles.destinationsContainer}>
          {recentDestinations.map(destination => (
            <Pressable 
              key={destination.id} 
              style={styles.destinationCard}
              onPress={() => slecetdLastDesine({ destination })}
              >
              <View style={styles.destinationLeft}>
                <Text style={styles.destinationText}>{destination.destino}</Text>
              </View>
              <View style={styles.destinationRight}>
                <Text style={styles.destinationDetails}>{destination.date}</Text>
                <Text style={styles.destinationDetails}>({destination.daysAgo})</Text>
              </View>
            </Pressable>
          ))}
        </View>
        {/* Modal for selected destination */}
        
    {/*    <LastDestinationSelected 
          selectedDestination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        /> */}


      </View>
    );
  }   
      


  const styles = StyleSheet.create({

        sectionContainer: {
      //    marginBottom: 24,
      },
        sectionTitle: {
          ...globalStyles.textSubtitle,
          marginBottom: 16,
          paddingHorizontal: 12,
        },
        destinationsContainer: {
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        destinationCard: {
          width: '96%', // mantiene el 80% del ancho del contenedor
          backgroundColor: globalColors.white,
          paddingVertical: 16,
          paddingHorizontal: 12,
          marginBottom: 12,
          borderRadius: 8,
          shadowColor: globalColors.taxiBlack,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          flexDirection: 'row', // added to arrange content horizontally
          justifyContent: 'space-between', // added to separate the two sides
        },
        destinationText: {
          ...globalStyles.textBody,
          color: globalColors.darkGray,
          fontWeight: '600',
        },
        destinationDetails: {
          ...globalStyles.textCaption,
          color: globalColors.darkGray,
          marginTop: 4,
        },
        // Added container for destination text.
        destinationLeft: {
          justifyContent: 'center',
          // ...existing code if any...
        },
        // Added container for date and daysAgo.
        destinationRight: {
          justifyContent: 'center',
          alignItems: 'flex-end',
          // ...existing code if any...
        },
      
  })