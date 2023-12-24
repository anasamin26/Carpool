import React from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Plus...
import plus from '../../assets/plus.png'

// Font Awesome Icons...
import { FontAwesome5 } from '@expo/vector-icons'
import { useRef } from 'react';
import { CreateRide } from '../ride/CreateRide';
import MyRides from '../ride/MyRides';
import AllRides from '../home/AllRides';
import MapScreen from '../home/MapScreen';

const Tab = createBottomTabNavigator();

// Hiding Tab Names...
export const BottomNavBar=()=> {
  // Animated Tab Indicator...
  return (
    <>
     <View style={styles.container}>
        <Tab.Navigator
            screenOptions={{
              showLabel: false,
              headerShown: false,
              style: {
                backgroundColor: '#000', // Set the background color to black
                height: 80,
                borderTopWidth: 0, // Remove top border
                shadowColor: 'transparent', // Remove shadow
              },
            }}
          >
          <Tab.Screen name={"All Rides"} component={AllRides} options={{
              tabBarIcon: ({ focused }) => (
                <View style={{
                  // centring Tab Button...
                  position: 'absolute',
                  top: 10
                }}>
                  <FontAwesome5
                    name="car"
                    size={20}
                    color={focused ? 'orange' : 'gray'}
                  ></FontAwesome5>
                </View>
              )
            }} >

          </Tab.Screen>

            <Tab.Screen name={"My Rides"} component={MyRides} options={{
              tabBarIcon: ({ focused }) => (
                <View style={{
                  // centring Tab Button...
                  position: 'absolute',
                  top: 10
                }}>
                  <FontAwesome5
                    name="car-side"
                    size={20}
                    color={focused ? 'orange' : 'gray'}
                  ></FontAwesome5>
                </View>
              )
            }}></Tab.Screen>
            <Tab.Screen name={"create"} component={CreateRide} options={{
              tabBarIcon: ({ focused }) => (
                <View style={{
                  // centring Tab Button...
                  position: 'absolute',
                  top: 0
                }}>
                  <FontAwesome5
                    name="plus"
                    size={35}
                    color={focused ? 'orange' : 'gray'}
                  ></FontAwesome5>
                </View>
              )
            }} ></Tab.Screen>

            <Tab.Screen name={"user"} component={MapScreen} options={{
              tabBarIcon: ({ focused }) => (
                <View style={{
                  // centring Tab Button...
                  position: 'absolute',
                  top: 10
                }}>
                  <FontAwesome5
                    name="user"
                    size={20}
                    color={focused ? 'orange' : 'gray'}
                  ></FontAwesome5>
                </View>
              )
            }} 
            ></Tab.Screen>

            <Tab.Screen name={"Settings"} component={SettingsScreen} options={{
              tabBarIcon: ({ focused }) => (
                <View style={{
                  position: 'absolute',
                  top: 10
                }}>
                  <FontAwesome5
                    name="bars"
                    size={20}
                    color={focused ? 'orange' : 'gray'}
                  ></FontAwesome5>
                </View>
              )
            }}>
            </Tab.Screen>
          </Tab.Navigator>
      </View>

      </>
  );
}


function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    color:'#000'
  },
});