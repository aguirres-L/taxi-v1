import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Animated, Image, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { globalColors } from "../../../presentation/theme/theme";

 export const DriverMarker = ({ driver }: { driver: any }) => {
    return (
        <Marker
            key={driver.id}

            coordinate={{
                latitude: driver.position.latitude,
                longitude: driver.position.longitude
            }}
           // anchor={{ x: 0.5, y: 0.5 }}
            rotation={driver.heading}

        >
                <View style={styles.taxiMarker}>
                    <MaterialCommunityIcons
                        name="taxi"
                        size={24}
                        color='#fff'
                    />
                </View> 
        </Marker>
    );
  };



  const styles = StyleSheet.create({
    driverMarkerContainer: {
        position: 'relative',
      },
      driverCarIcon: {
        width: 30,
        height: 30,
        zIndex: 10,
      },
      driverPulse: {
        position: 'absolute',
        top: -15,
        left: -15,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(74, 144, 226, 0.3)',
      },
      taxiMarker: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: globalColors.taxiYellow,
        backgroundColor: globalColors.taxiYellow ,

    },
  })