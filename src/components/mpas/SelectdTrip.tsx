import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { globalColors } from '../../presentation/theme/theme';
import { useState } from 'react';
import { RideOption } from '../../infrastructure/interface/InterfaceRediOptions';


interface OptionsSelectdTripProps {
    rideOptions: RideOption[];
}

export const SelectdTrip = ( { rideOptions} : OptionsSelectdTripProps ) => {
    const [selectedRide, setSelectedRide] = useState<string | null>(null);

    return(
        <>
         {/* Botón de confirmación */}
                    <View style={styles.confirmButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                !selectedRide && styles.disabledButton
                            ]}
                            disabled={!selectedRide}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmButtonText}>
                                {selectedRide 
                                    ? `Confirmar ${rideOptions.find(r => r.id === selectedRide)?.name}`
                                    : 'Selecciona un viaje'}
                            </Text>
                        </TouchableOpacity>
                    </View>
        </>
    )

}

const styles = StyleSheet.create({
    
        confirmButtonContainer: {
            padding: 16,
            backgroundColor: globalColors.white,
            borderTopWidth: 1,
            borderTopColor: globalColors.lightGray,
        },
        confirmButton: {
            backgroundColor: globalColors.taxiYellow,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            shadowColor: globalColors.taxiBlack,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
        },
        confirmButtonText: {
            fontSize: 18,
            fontWeight: '600',
            color: globalColors.white,
        },
        disabledButton: {
            backgroundColor: globalColors.disabled,
        },
    });