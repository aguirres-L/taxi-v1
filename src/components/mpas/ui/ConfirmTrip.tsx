import { Pressable, StyleSheet, Text, View } from "react-native"
import { globalColors } from "../../../presentation/theme/theme"


export const ConfirmTrip = ({
    distance,
    estimatedTime,
    estimatedPrice,
    setLookingForADriver
}: {
    distance: any;
    estimatedTime: any;
    estimatedPrice: any;
    setLookingForADriver: any;
}) => {

    return(

           <View style={styles.tripDetails}>
                  <Text style={styles.tripText}>
                    <Text style={styles.tripTextLabel}>Distancia: </Text>
                    <Text style={styles.tripTextValue}>{distance.toFixed(2)} km</Text>
                  </Text>
                  
                  <Text style={styles.tripText}>
                    <Text style={styles.tripTextLabel}>Tiempo estimado: </Text>
                    <Text style={styles.tripTextValue}>{estimatedTime.toFixed(0)} min</Text>
                  </Text>
                  
                  <Text style={styles.tripText}>
                    <Text style={styles.tripTextLabel}>Precio: </Text>
                    <Text style={styles.tripTextValue}>${estimatedPrice.toFixed(2)}</Text>
                  </Text>
                  
                  <Pressable 
                    style={({ pressed }) => [
                      { marginTop: 20 },
                      pressed && styles.pressedButton
                    ]}
                    onPress={() =>       setLookingForADriver(true)}
                  >
                    <Text style={styles.confirmTrip}>Confirmar viaje</Text>
                  </Pressable>
                </View>

    )
}


const styles = StyleSheet.create({

    
          tripDetails: {
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 6,
            borderTopWidth: 5,
            borderTopColor: globalColors.taxiDarkYellow,
          },
          tripText: {
            fontSize: 16,
            color: globalColors.taxiBlack,
            marginBottom: 10,
            fontWeight: '500',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          },
          tripTextLabel: {
            color: '#666',
            fontWeight: '400',
          },
          tripTextValue: {
            fontWeight: '600',
            color: globalColors.taxiBlack,
          },
          confirmTrip: {
            marginTop: 15,
            paddingVertical: 14,
            fontSize: 18,
            color: '#FFF',
            backgroundColor: globalColors.taxiDarkYellow,
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            elevation: 3,
            shadowColor: globalColors.taxiDarkYellow,
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          },
          pressedButton: {
            opacity: 0.9,
            transform: [{ scale: 0.98 }],
            backgroundColor: '#D4A012', // Un amarillo más oscuro para el efecto de presión
          },

})