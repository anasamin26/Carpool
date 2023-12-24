import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet ,Pressable,Animated, Dimensions, Image, Platform } from 'react-native';
import tailwind from "twrnc";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { useFocusEffect,useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import  {LinearGradient}  from 'expo-linear-gradient'
 

const Tab = createMaterialTopTabNavigator();
const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
  
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
            >
              <Text style={[styles.tabText, { color: isFocused ? '#3498db' : '#2c3e50' }]}>
                {label}
              </Text>
              {index < state.routes.length - 1 && (
                <View style={styles.divider} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
const MyRides = ({ route }) => {
  const { ridesUpdated } = route.params || " ";
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [attendeerides, setAttendeeRides] = useState([]);
  const navigation = useNavigation();
  const [loggedInUser,setLoggedInUser]=useState(null)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        console.log(userData)
        setLoggedInUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    getUserData();
    fetchRidesByAttendee();
    fetchRidesByOrganizer();
  }, []);

  useEffect(() => {
 
    fetchRidesByAttendee();
    fetchRidesByOrganizer();
  }, [loggedInUser]);

  const fetchRidesByOrganizer = async () => {
    try {
      if (loggedInUser) { // Check if loggedInUser is not null
        const response = await axios.get(`http://192.168.0.104:8000/api/get_rides_by_organizer/${loggedInUser.id}/`);
        console.log('API Response:', response.data);
        setAppointments(response.data);
      } 
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };
const fetchRidesByAttendee = async () => {
try {
  const apiUrl = 'http://192.168.0.104:8000/api/get_rides_by_attendee/';
  if (loggedInUser) { 
  const response = await axios.get(apiUrl, {
    params: {
      user_id: loggedInUser.id,
    },
  });
  console.log('Rides Attended:', response.data);
  setAttendeeRides(response.data);}
} catch (error) {
  console.error('Error fetching rides:', error);
}
};

  useFocusEffect(
    React.useCallback(() => {
      console.log('MyRides is focused. Re-rendering...');
      fetchRidesByAttendee()
      fetchRidesByOrganizer()
    }, [loggedInUser])
  );

  
  const getStatusLabel = (key) => {
    const statuses = { 'C': 'Completed', 'A': 'Available', 'I': 'In Progress' };
    return statuses[key] || 'Unknown';
  };

  const ListComponentAttendees=()=>{
    return(
        <View style={styles.ridescard}>
    <FlatList
        contentContainerStyle={styles.listContainer}
        data={appointments.filter(searchFilter)}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id.toString()}
      />
      </View>
      )
  }
  const ListComponentJoiniee=()=>{
    return(
      <View style={styles.ridescard}>
        <FlatList
            contentContainerStyle={styles.listContainer}
            data={attendeerides.filter(searchFilter)}
            renderItem={renderAppointmentCard}
            keyExtractor={(item) => item.id.toString()}
          />
      </View>
      )
  }

  const renderAppointmentCard = ({ item }) => (
    <LinearGradient
    colors={item.background_colors}
    style={{
      marginBottom: 20,
      padding: 10,
      borderRadius: 5,}}
>        
       <Text style={[styles.cardTitle, { color: item.title_color }]}>{item.from_location} - {item.to_location}</Text>
      <View style={styles.cardDates}>
        <Text style={styles.cardContent}>Date: {item.start_date}</Text>
      </View>
      <View style={styles.cardDates}>
        <Text style={styles.cardContent}>Time: {item.start_time}</Text>
      </View>
      <View>
      <Text style={styles.cardContent}>{getStatusLabel(item.status)}</Text>
      </View>
      <View style={styles.cardContent}>

      {item.attendees && (
      <>
        <View style={styles.attendeesContainer}>
          {item.attendees.map((attendee) => (
            <Image key={attendee.id} source={{ uri: attendee.
            avatar }} style={styles.attendeeImage} />
          ))}
        </View>
        </>
      )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('RideDetails', { rideId: item.id })}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>        
        </View>
      </View>
</LinearGradient>
  );

  const searchFilter = (item) => {
    const query = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Carpool</Text>
        {/* <Pressable onPress={() => 
          {AsyncStorage.removeItem('user')
          navigation.navigate('Home')}}>
          <Text style={tailwind`text-gray-50 font-bold`}>Logout</Text>
        </Pressable> */}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View>
        <Text style={styles.allridestitle}>My Rides</Text>

      </View>
      <Tab.Navigator style={styles.cool} tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Your Rides" component={ListComponentAttendees} />
        <Tab.Screen style={styles.containerofWholeScreen} name="Rides You Joined" component={ListComponentJoiniee} />
      </Tab.Navigator>    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop:60,
    backgroundColor: "#000",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000', 
  },
  allridestitle:{
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:10,
    color:'#fff'
  }
  ,
  listContainer:{
    paddingHorizontal:10,
    backgroundColor:'black'
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 2,
    borderRadius:5,
    borderColor:'#A9A9A9',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor:'#fff',
    opacity:0.8,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor:'#000'
  },
  cardTitle: {
    fontSize:18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  cardAttendees: {
    fontSize:14,
    fontWeight: 'bold',
  },
  cardDates: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  cardDate: {
    color: '#888',
  },
  cardContent: {
    justifyContent: 'space-between',
    paddingTop: 3,
  },
  attendeesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  attendeeImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth:0.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginTop:15,
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },
  ridescard:{
    backgroundColor:'#000',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    width:160,
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#2c3e50',
    borderRadius:40,
    marginBottom:10,
    alignSelf:'center'
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',

  },
  divider: {
    height: '95%', // Adjust the height of the divider
    width: 2,
    backgroundColor: '#000',
    marginLeft:5
  },
  containerofWholeScreen:{
    backgroundColor:'#000',
    color:'black'
  }
});
export default MyRides;