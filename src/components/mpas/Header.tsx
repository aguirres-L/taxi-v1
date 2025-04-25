
import { View, Text,StyleSheet } from 'react-native';
import { globalStyles } from '../../presentation/theme/theme';

export const Header = () => {
    return (
         <View style={styles.headerContainer}>
                       <Text style={globalStyles.headerTitle}>¿A dónde vas?</Text>
                   </View>
    );
}

// Estilos mejorados
const styles = StyleSheet.create({
    headerContainer: globalStyles.header,})