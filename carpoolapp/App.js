import { Login } from './appcomponents/auth/Login';
import { PasswordReset } from './appcomponents/auth/ResetPassword';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { UserProfile } from './appcomponents/auth/UserProfile';
import {Signup} from './appcomponents/auth/Signup';
import Toast from 'react-native-toast-message';
import React, { useRef } from 'react';
import OnboardingScreen from './appcomponents/auth/OnboardingScreen';

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapScreen from './appcomponents/home/MapScreen';
import RideDetailsScreen from './appcomponents/ride/RideDetails';
import { BottomNavBar } from './appcomponents/navbar/BottomNavbar';
import AllRides from './appcomponents/home/AllRides';
import MyRides from './appcomponents/ride/MyRides';
import { EditRide } from './appcomponents/ride/EditRide';

const Stack = createNativeStackNavigator();

export default function App() {
  const signupRef = useRef(); // Create a ref for the Signup component
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value === null) {
        // Update AsyncStorage and set isFirstLaunch to true
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header by default
      }}
      >
    {isFirstLaunch !== null && isFirstLaunch && (
         <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{ title: 'Carpool' }}
        />)}
        <Stack.Screen
          name="Home"
          component={Login}
          options={{ title: 'Carpool' }}
        />
        <Stack.Screen name="Passwordreset" component={PasswordReset} />
        {/* Pass the ref to the Signup component */}
        <Stack.Screen name="Signup">
          {(props) => <Signup {...props} ref={signupRef} />}
        </Stack.Screen>
        <Stack.Screen name="BottomNavbar" component={BottomNavBar} />
        <Stack.Screen name="UserProfile" component={AllRides} />
        <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
        <Stack.Screen name="MyRides" component={MyRides} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="EditRide" component={EditRide} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

