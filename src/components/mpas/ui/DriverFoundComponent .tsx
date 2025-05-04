import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const DriverFoundComponent = ({ 
    driver, 
    onCancel 
  }: { 
    driver: any, 
    onCancel: () => void 
  }) => {
    return (
      <View style={styles.driverFoundContainer}>
        <View style={styles.driverFoundHeader}>
          <Text style={styles.driverFoundTitle}>Chofer encontrado</Text>
          <Text style={styles.driverFoundSubtitle}>En camino a tu ubicación</Text>
        </View>
        
        <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitials}>
              {driver.name.charAt(0)}{driver.lastName.charAt(0)}
            </Text>
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>
              {driver.name} {driver.lastName}
            </Text>
            <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
            <Text style={styles.driverCar}>{driver.carModel}</Text>
          </View>
        </View>
        
        <View style={styles.driverVehicleInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Número de taxi</Text>
            <Text style={styles.infoValue}>{driver.taxiNumber}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Patente</Text>
            <Text style={styles.infoValue}>{driver.licensePlate}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{driver.phone}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar viaje</Text>
        </TouchableOpacity>
      </View>
    );
  };



  const styles = StyleSheet.create({

    driverFoundContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        right: 20,
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      driverFoundHeader: {
        marginBottom: 16,
      },
      driverFoundTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      driverFoundSubtitle: {
        fontSize: 14,
        color: '#666',
      },
      driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      driverInitials: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
      driverDetails: {
        flex: 1,
      },
      driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      driverRating: {
        fontSize: 14,
        color: '#f39c12',
      },
      driverCar: {
        fontSize: 14,
        color: '#666',
      },
      driverVehicleInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        flexWrap: 'wrap',
      },
      infoItem: {
        width: '48%',
        marginBottom: 8,
      },
      infoLabel: {
        fontSize: 12,
        color: '#999',
      },
      infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
      },
      cancelButton: {
        backgroundColor: '#e74c3c',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
      },
      cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },

  })