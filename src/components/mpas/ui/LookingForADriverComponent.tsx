import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { globalColors } from "../../../presentation/theme/theme"



export const LookingForADriverComponent=({
    cancelSearch,
    scale,
    estimatedTime
} : {  
    cancelSearch:any;
    scale:number;
    estimatedTime: number;
})=>{
    return(

   <View style={styles.searchingDriverContainer}>
            {/* Header con botón de cancelar */}
            <View style={styles.searchingHeader}>
              <Pressable onPress={() => cancelSearch()}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
            </View>
            
            {/* Contenido principal */}
            <View style={styles.searchingContent}>
              {/* Animación/Loader */}
              <View style={styles.loadingAnimation}>
                <View  style={[
                styles.pulsingCircle,
                { transform: [{ scale }] }
              ]} />
                <Image 
                  source={require('../../../assets/new-logo.png')} 
                  style={styles.taxiIcon} 
                />
              </View>
              
              {/* Textos informativos */}
              <Text style={styles.searchingTitle}>Buscando conductor</Text>
              <Text style={styles.searchingSubtitle}>Estamos contactando taxis cerca de ti</Text>
          
              
            </View>
            
            {/* Footer con tiempo estimado */}
            <View style={styles.searchingFooter}>
              <Text style={styles.estimatedTimeText}>Tiempo estimado: {estimatedTime.toFixed(0)} min</Text>
          
            </View>
          </View>
    )
}

const styles = StyleSheet.create({
        searchingDriverContainer: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          height: '40%',
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: -5 },
          shadowRadius: 10,
        },
        searchingHeader: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 15,
        },
        cancelText: {
          color: globalColors.taxiDarkYellow,
          fontWeight: 'bold',
          fontSize: 16,
        },
        searchingContent: {
          alignItems: 'center',
          flex: 1,
        },
        loadingAnimation: {
          width: 120,
          height: 120,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        },
        pulsingCircle: {
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(255, 204, 0, 0.2)',
         // transform: [{ scale: 0.8 }],
          // Animación (puedes implementarla con react-native-reanimated)
        },
        taxiIcon: {
          width: 60,
          height: 60,
          resizeMode: 'contain',
        },
        searchingTitle: {
          fontSize: 22,
          fontWeight: 'bold',
          color: globalColors.taxiBlack,
          marginBottom: 5,
        },
        searchingSubtitle: {
          fontSize: 16,
          color: '#666',
          marginBottom: 25,
        },
        tripInfoMini: {
          width: '100%',
          paddingHorizontal: 20,
        },
        tripInfoText: {
          fontSize: 14,
          color: '#555',
          marginBottom: 5,
        },
        searchingFooter: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingTop: 15,
          alignItems: 'center',
        },
        estimatedTimeText: {
          color: globalColors.taxiDarkYellow,
          fontWeight: '600',
        },


})