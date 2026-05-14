import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeOnboardingScreen from './src/screens/WelcomeOnboardingScreen';
import UserImageUploadScreen from './src/screens/UserImageUploadScreen';
import OutfitSelectionScreen from './src/screens/OutfitSelectionScreen';
import LoadingProcessingScreen from './src/screens/LoadingProcessingScreen';
import TransformationResultsScreen from './src/screens/TransformationResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#09090b' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeOnboardingScreen} />
        <Stack.Screen name="Upload" component={UserImageUploadScreen} />
        <Stack.Screen name="OutfitSelection" component={OutfitSelectionScreen} />
        <Stack.Screen name="Loading" component={LoadingProcessingScreen} />
        <Stack.Screen name="Results" component={TransformationResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
