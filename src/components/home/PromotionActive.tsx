import { globalColors, globalStyles } from "../../presentation/theme/theme";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, SafeAreaView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
export const PromotionActive = () => {
    return (
        <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Promociones activas</Text>
        <View style={styles.promoCard}>
            <MaterialIcons name="local-offer" size={24} color={globalColors.taxiYellow} />
            <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>20% OFF en tu primer viaje</Text>
            <Text style={styles.promoSubtitle}>Usa el código BIENVENIDO</Text>
            </View>
        </View>
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
       promoCard: {
        backgroundColor: globalColors.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: globalColors.taxiBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      promoTextContainer: {
        flex: 1,
        marginLeft: 12,
      },
      promoTitle: {
        ...globalStyles.textBody,
        fontWeight: '600',
      },
      promoSubtitle: {
        ...globalStyles.textCaption,
      },
 })