import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { globalColors } from "../../presentation/theme/theme";
import { useState, useEffect } from "react";
import { useLocationStore } from "../../presentation/store/location/location";
import * as Location from 'expo-location';

type FormOfLocationProps = {
  onDestinationSelected: (coords: { latitude: number; longitude: number }, address: string) => void;
  onFocus?: () => void;
};

export const FormOfLocation = ({ onDestinationSelected, onFocus }: FormOfLocationProps) => {
  const { userLocation, fetchUserLocation, setUserLocation,destination, setDestination,setRouteCoordinates } = useLocationStore();
  const [pickupText, setPickupText] = useState('Mi ubicación');
  const [destinationText, setDestinationText] = useState(destination?.address || '');

  useEffect(() => {
    if (userLocation) {
      Location.reverseGeocodeAsync(userLocation.coords)
        .then(addresses => {
          if (addresses && addresses.length > 0) {
            const addr = addresses[0];
            // Usa addr.street y addr.streetNumber si están disponibles
            setPickupText(`${addr.street || ''} ${addr.streetNumber || ''}`.trim());
          } else {
            setPickupText(`Lat: ${userLocation.coords.latitude.toFixed(4)}, Lon: ${userLocation.coords.longitude.toFixed(4)}`);
          }
        })
        .catch(error => {
          console.error("Error en reverseGeocodeAsync", error);
          setPickupText(`Lat: ${userLocation.coords.latitude.toFixed(4)}, Lon: ${userLocation.coords.longitude.toFixed(4)}`);
        });
    }
  }, [userLocation]);

  // Función para parsear "lat, lon" a objeto de coordenadas
  const parseCoordinates = (text: string) => {
    const parts = text.split(',');
    if(parts.length === 2) {
      const latitude = parseFloat(parts[0].trim());
      const longitude = parseFloat(parts[1].trim());
      if(!isNaN(latitude) && !isNaN(longitude)) {
         return { latitude, longitude };
      }
    }
    return null;
  };

  const clearDestination = () => {
    setDestination({latitude:undefined, longitude: undefined, address:undefined });
    setDestinationText('');
    setRouteCoordinates([]);
  }


  return (
    <View style={styles.locationForm}>
      {/* Campo de origen (editable) */}
      <View style={styles.locationInputContainer}>
        <MaterialIcons 
          name="my-location" 
          size={24} 
          color={globalColors.taxiYellow} 
          style={styles.inputIcon}
          onPress={onFocus}
        />
        <TextInput
          style={styles.locationInput}
          placeholder="Ubicación "
          placeholderTextColor={globalColors.placeholder}
          value={pickupText}
          onChangeText={setPickupText}
          onSubmitEditing={() => {
            const coords = parseCoordinates(pickupText);
            if(coords) {
              setUserLocation({ 
                coords: { ...coords, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 },
                timestamp: Date.now()
              });
            }
          }}
        />
        <TouchableOpacity /* onFocus={onFocus} */ onPress={onFocus}>
          <MaterialIcons 
            name="gps-fixed" 
            size={20} 
            color={globalColors.darkGray} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Campo de destino (editable) */}
      <View style={styles.locationInputContainer}>
        <MaterialIcons 
          name="location-on" 
          size={24} 
          color={globalColors.danger} 
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.locationInput}
          placeholder="Destino"
          placeholderTextColor={globalColors.placeholder}
          value={destinationText}
          onChangeText={setDestinationText}
          onSubmitEditing={() => {
            const coords = parseCoordinates(destinationText);
            if(coords) {
              // Si se pudo parsear, usamos reverse para obtener la dirección si es posible
              Location.reverseGeocodeAsync(coords)
                .then(addresses => {
                  let addressString = destinationText;
                  if(addresses && addresses.length > 0) {
                    const addr = addresses[0];
                    addressString = `${addr.street || ''} ${addr.streetNumber || ''}`.trim() || destinationText;
                  }
                  setDestination({ ...coords, address: addressString });
                  onDestinationSelected(coords, addressString);
                })
                .catch(error => {
                  console.error("Error en reverseGeocodeAsync para destino", error);
                  setDestination({ ...coords, address: destinationText });
                  onDestinationSelected(coords, destinationText);
                });
            } else {
              // Si no es un par numérico, tratamos de geocodificar la dirección
              Location.geocodeAsync(destinationText)
                .then(results => {
                  if(results && results.length > 0) {
                    const first = results[0];
                    const newCoords = { latitude: first.latitude, longitude: first.longitude };
                    setDestination({ ...newCoords, address: destinationText });
                    onDestinationSelected(newCoords, destinationText);
                  } else {
                    console.warn("No se encontraron coordenadas para la dirección");
                  }
                })
                .catch(error => {
                  console.error("Error en geocodeAsync para destino", error);
                });
            }
          }}
        />
        
        <TouchableOpacity onPress={clearDestination}>
          <MaterialIcons 
            name="close" 
            size={20} 
            color={globalColors.darkGray} 
          />
        </TouchableOpacity>


      </View>
    </View>
  );
};

// Estilos (igual que antes)
const styles = StyleSheet.create({
  locationForm: {
    backgroundColor: globalColors.white,
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 8,
    shadowColor: globalColors.taxiBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: globalColors.taxiBlack,
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: globalColors.lightGray,
    marginHorizontal: 12,
  },
});