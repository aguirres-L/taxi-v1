import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
//import { MaterialIcons } from '@expo/vector-icons';
import { globalColors, globalStyles, } from '../../theme/theme';
import { UltimosDestinos } from '../../../components/home/UltimosDestinos';
import { PromotionActive } from '../../../components/home/PromotionActive';
import { useLocationStore } from '../../store/location/location';
import { TravelSelect } from '../../../components/home/TravelSelect';

export const HomeScreen = () => {

    const { recentTrips ,setRecentTrips} = useLocationStore();
  

  useEffect(() => {
    setRecentTrips([]); // Simulate the recent trip with an empty array or appropriate data
    console.log(recentTrips[0], 'recentTrips en LastDestinationSelected');
  }, []);
  // Datos simulados para ultimos destinos con fecha y días 
  const recentDestinations =recentTrips.map((trip,index) => ({
    id: index.toString(),
    destino: trip.destinationAddress || 'Destino',
    origin: trip.originAddress || 'Origen',
    date: trip.date || 'Fecha no disponible',
    daysAgo: trip.date ? 'X días' : 'Sin fecha',
  }));
  
  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* <Text style={globalStyles.headerTitle}>Taxi Córdoba</Text>
         */}
      
            <Image
              source={require('../../../assets/new-logo.png')}
              style={{ width: 150, height: 50, resizeMode: 'contain' }}
            /> 

      </View>

      {/* Contenido principal */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Botón principal */}
      <TravelSelect />

        {/* Opciones rápidas: Ultimos Destinos */}
      <UltimosDestinos recentDestinations={recentDestinations} />

        {/* Promociones o información  
        
        tendria que pasar los datos de las promociones*/}

          <PromotionActive />
      
      
      </ScrollView>



      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Viaja seguro con Taxis de Córdoba</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: globalStyles.header,
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
    color: globalColors.taxiBlack,
    marginLeft: 12,
    fontSize: 18,
  },

  footerContainer: {
    backgroundColor: globalColors.taxiBlack,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: globalColors.lightGray,
  },
  footerText: {
    ...globalStyles.textCaption,
    color: globalColors.textOnDark,
  },
});