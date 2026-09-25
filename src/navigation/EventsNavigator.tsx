import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EventDetailScreen} from '../screens/events/EventDetailScreen';
import {EventFormScreen} from '../screens/events/EventFormScreen';
import {EventsListScreen} from '../screens/events/EventsListScreen';
import {colors} from '../theme';
import {EventsStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<EventsStackParamList>();

export function EventsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="EventsList"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="EventsList" component={EventsListScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen
        name="EventForm"
        component={EventFormScreen}
        options={{presentation: 'modal'}}
      />
    </Stack.Navigator>
  );
}
