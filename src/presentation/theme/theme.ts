import { Platform, StatusBar, StyleSheet } from "react-native";

export const globalColors = {
    // Paleta principal (amarillo taxi de Córdoba)
    taxiYellow: "#FFD700",  // Amarillo dorado vibrante
    taxiDarkYellow: "#FFC000", // Amarillo más oscuro para contrastes
    taxiBlack: "#1A1A1A",  // Negro no puro para mejor legibilidad
    
    // Paleta secundaria
    white: "#FFFFFF",
    lightGray: "#F5F5F5",
    mediumGray: "#E0E0E0",
    darkGray: "#757575",
    
    // Colores funcionales
    success: "#4CAF50",
    warning: "#FF9800",
    danger: "#F44336",
    info: "#2196F3",
    
    // Textos
    textPrimary: "#1A1A1A",
    textSecondary: "#757575",
    textOnYellow: "#1A1A1A", // Texto sobre amarillo
    textOnDark: "#FFFFFF",
    
    // Estados
    disabled: "#E0E0E0",
    placeholder: "#BDBDBD",
}

export const globalStyles = StyleSheet.create({
    // Estilos de texto
    textTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: globalColors.textPrimary,
        marginBottom: 8,
    },
    textSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: globalColors.darkGray,
        marginBottom: 6,
    },
    textBody: {
        fontSize: 16,
        color: globalColors.textPrimary,
        lineHeight: 24,
    },
    textCaption: {
        fontSize: 14,
        color: globalColors.textSecondary,
    },
    
    // Contenedores
    container: {
        flex: 1,
        backgroundColor: globalColors.white,
    },
    card: {
        backgroundColor: globalColors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: globalColors.taxiBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginVertical: 8,
    },
    
    // Botones
    buttonPrimary: {
        backgroundColor: globalColors.taxiYellow,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimaryText: {
        color: globalColors.textOnYellow,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        backgroundColor: globalColors.taxiBlack,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondaryText: {
        color: globalColors.textOnDark,
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Header
    header: {
        width: '100%',
        backgroundColor: globalColors.taxiDarkYellow,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 16,
        paddingHorizontal: 16,
        shadowColor: globalColors.taxiBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: globalColors.textOnYellow,
    },
    
    // Inputs
    input: {
        backgroundColor: globalColors.white,
        borderWidth: 1,
        borderColor: globalColors.mediumGray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: globalColors.textPrimary,
        marginVertical: 8,
    },
    inputLabel: {
        fontSize: 14,
        color: globalColors.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    
    // Footer
    footer: {
        backgroundColor: globalColors.taxiBlack,
        padding: 16,
        alignItems: 'center',
    },
    footerText: {
        color: globalColors.textOnDark,
        fontSize: 12,
    },
});