import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {EventsNavigator} from './src/navigation/EventsNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <EventsNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
