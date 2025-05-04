import { Marker } from "react-native-maps"


export const DestinoMarker=({ destination, routeCoordinates }: { destination: { latitude: number; longitude: number }; routeCoordinates: { latitude: number; longitude: number }[] })=>{

    return(

        <>
               {destination && routeCoordinates?.length > 0 &&   (
            <Marker
              coordinate={destination}
              title="Destino"
              pinColor="blue"
            />
          )}
        </>
    )

}