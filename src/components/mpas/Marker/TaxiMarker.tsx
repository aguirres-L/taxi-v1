import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps"



interface Destination {
    address: string;
}

interface Taxi {
    id: string;
    latitude: number;
    longitude: number;
    heading: number;
    available: boolean;
}

export const TaxiMarker = ({ destinationAddres, taxis }: {
    destinationAddres: Destination;
    taxis: Taxi[]
}) => {
    return (
        <>

            {destinationAddres?.address && (
                taxis.map(taxi => {

                    return (
                        <Marker
                            key={taxi.id}
                            coordinate={{
                                latitude: taxi.latitude,
                                longitude: taxi.longitude,
                            }}
                            rotation={taxi.heading}
                        >
                            <View style={styles.taxiMarker}>
                                <MaterialCommunityIcons
                                    name="taxi"
                                    size={24}
                                    color={taxi.available ? '#2ecc71' : '#e74c3c'}
                                />
                            </View>
                        </Marker>
                    )
                })
            )
            }
        </>
    )
}


const styles = StyleSheet.create({
    taxiMarker: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
})