// Función para decodificar la polyline
export const decodePolyline = (encoded: string) => {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: { latitude: number; longitude: number }[] = [];

    while (index < encoded.length) {
        let b;
        let shift = 0;
        let result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += dlng;
    
        coordinates.push({ latitude: lat * 1e-5, longitude: lng * 1e-5 });
    }
    return coordinates;
};