import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../screens/loading/LoadingScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { MapScreen } from '../screens/maps/MapScreen';



export type RootStackParams = {
    LoadingScreen: undefined;
    Home : undefined;
    MapScreen: undefined;
    ProfileScreen: undefined;
    Settings: undefined;

}

const Stack = createNativeStackNavigator<RootStackParams>();

export const StackNavigtor =() =>  {

    return(

        <Stack.Navigator
            id={undefined}
            initialRouteName='LoadingScreen'
            screenOptions={{
                headerShown : false
            }}
        >

            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />


        </Stack.Navigator>

    )

}