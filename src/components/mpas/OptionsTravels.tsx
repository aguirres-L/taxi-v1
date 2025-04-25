import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { globalColors, } from '../../presentation/theme/theme';
import { RideOption } from '../../infrastructure/interface/InterfaceRediOptions';
import { useState } from 'react';



interface OptionsTravelsProps {
    rideOptions: RideOption[];
}

export const OptionsTravels = ({ rideOptions }: OptionsTravelsProps) => {
    const [selectedRide, setSelectedRide] = useState<string>('');
 
    return (
        <>

            <View style={styles.rideOptionsTitleContainer}>
                <Text style={styles.sectionTitle}>Elige tu viaje</Text>
            </View>

            <ScrollView
                style={styles.rideOptionsScroll}
                contentContainerStyle={styles.rideOptionsContent}
                showsVerticalScrollIndicator={false}
            >
                {rideOptions?.map((ride) => (
                    <TouchableOpacity
                        key={ride.id}
                        style={[
                            styles.rideOption,
                            selectedRide === ride.id && styles.selectedRideOption
                        ]}
                        onPress={() => setSelectedRide(ride.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.rideIconContainer}>
                            <MaterialIcons
                                name={ride.icon as any}
                                size={28}
                                color={
                                    selectedRide === ride.id
                                        ? globalColors.white
                                        : globalColors.taxiYellow
                                }
                            />
                        </View>
                        <View style={styles.rideInfo}>
                            <Text style={[
                                styles.rideName,
                                selectedRide === ride.id && styles.selectedRideText
                            ]}>
                                {ride.name}
                            </Text>
                            <Text style={[
                                styles.rideTime,
                                selectedRide === ride.id && styles.selectedRideText
                            ]}>
                                {ride.time}
                            </Text>
                        </View>
                        <Text style={[
                            styles.ridePrice,
                            selectedRide === ride.id && styles.selectedRideText
                        ]}>
                            {ride.price}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </>
    )
}


// Estilos mejorados
const styles = StyleSheet.create({



    rideOptionsTitleContainer: {
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: globalColors.taxiBlack,
    },
    rideOptionsScroll: {
        flex: 1,
    },
    rideOptionsContent: {
        paddingBottom: 16,
    },
    rideOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: globalColors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: globalColors.lightGray,
    },
    selectedRideOption: {
        backgroundColor: globalColors.taxiYellow,
        borderColor: globalColors.taxiYellow,
    },
    rideIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: globalColors.taxiYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    selectedRideIconContainer: {
        backgroundColor: globalColors.taxiBlack,
    },
    rideInfo: {
        flex: 1,
    },
    rideName: {
        fontSize: 16,
        fontWeight: '500',
        color: globalColors.taxiBlack,
        marginBottom: 4,
    },
    rideTime: {
        fontSize: 14,
        color: globalColors.mediumGray,
    },
    ridePrice: {
        fontSize: 16,
        fontWeight: '600',
        color: globalColors.taxiBlack,
    },
    selectedRideText: {
        color: globalColors.white,
    },
})