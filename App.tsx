import { NavigationContainer } from '@react-navigation/native';
import { StackNavigtor } from './src/presentation/navigation/StackNavigation';

export default function App() {
  return (
    <>
    <NavigationContainer>
   <StackNavigtor/>
    </NavigationContainer>
    </>
  );
}
