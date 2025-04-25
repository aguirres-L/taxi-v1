import { Image, Pressable, Text, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { globalColors, globalStyles } from "../../presentation/theme/theme";
import { useNavigation } from '@react-navigation/native';



export const TravelSelect = () => {
  const navigation = useNavigation();

    return (
        <Pressable 
        style={styles.mainButton}
        onPress={() => navigation.navigate('MapScreen' as never)}
        android_ripple={{ color: globalColors.taxiDarkYellow }}
      >
        <MaterialIcons name="directions" size={28} color={globalColors.white} />
        <Text style={styles.mainButtonText}>¿A dónde vas hoy?</Text>
      </Pressable>
    );

}


const styles = StyleSheet.create({
 
  contentContainer: globalStyles.container,
  scrollContent: {
    paddingBottom: 20,
  },
  mainButton: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: globalColors.taxiDarkYellow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginVertical: 24,
    shadowColor: globalColors.taxiBlack,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  mainButtonText: {
    color: globalColors.white,
    marginLeft: 12,
    fontSize: 18,
  },


});