import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet ,Pressable,Animated, Dimensions, Image, Platform } from 'react-native';
import tailwind from "twrnc";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import  {LinearGradient}  from 'expo-linear-gradient'



const AllRides = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const apiEndpoint = 'https://carpool-backend-rho.vercel.app/api/rides/';

    axios.get(apiEndpoint)
      .then(response => {
        const updatedAppointments = response.data;
        setAppointments(updatedAppointments);
      })
      .catch(error => {
        console.error('Error fetching ride data: ', error);
      });
  }, []);

  const updateRides =()=>{
    const apiEndpoint = 'https://carpool-backend-rho.vercel.app/api/rides/';

    axios.get(apiEndpoint)
      .then(response => {
        const updatedAppointments = response.data;
        setAppointments(updatedAppointments);
      })
      .catch(error => {
        console.error('Error fetching ride data: ', error);
      });
  }
  useFocusEffect(
    React.useCallback(() => {
      console.log('AllRides is focused. Re-rendering...');
      updateRides();
    }, [])
  );


  const getStatusLabel = (key) => {
    const statuses = { 'C': 'Completed', 'A': 'Available', 'I': 'In Progress' };
    return statuses[key] || 'Unknown';
  };
  //   const [appointments, setAppointments] = useState([
  //   {
  //     id: 1,
  //     title: 'Dummy Ride 1',
  //     startDate: '2023-05-18',
  //     endDate: '2023-05-18',
  //     startTime:"11:00 AM",
  //     endTime:"12:00 PM",
  //     status:'I',
  //     capcaity:3,
  //     from:'CC Block',
  //     to:'i2c Inc',
  //     totalFare:1000,
  //     car:'Honda City',
  //     attendees: [
  //       { id: 10, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
  //       { id: 1, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar1.png' },
  //       { id: 2, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
  //       { id: 3, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar8.png' },
  //     ],
  //     backgroundColor: '#ffdcb2',
  //     titleColor: '#ff8c00',
  //   },
  //   {
  //     id: 2,
  //     title: 'Dummy Ride 2',
  //     startDate: '2023-05-19',
  //     endDate: '2023-05-19',
  //     startTime:"11:00 AM",
  //     endTime:"12:00 PM",
  //     status:'C',
  //     from:'CC Block',
  //     to:'SolutionInn',
  //     capcaity:3,
  //     totalFare:1500,
  //     car:'Honda City',
  //     attendees: [
  //       { id: 7, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
  //       { id: 8, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar4.png' },
  //       { id: 9, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar6.png' },
  //     ],
  //     backgroundColor: '#bfdfdf',
  //     titleColor: '#008080',
  //   },
  //   {
  //     id: 3,
  //     title: 'Dummy Ride 3',
  //     startDate: '2023-05-19',
  //     endDate: '2023-05-19',
  //     startTime:"11:00 AM",
  //     endTime:"12:00 PM",
  //     status:'A',
  //     from:'Lahore',
  //     to:'Islamabad',
  //     capcaity:3,
  //     totalFare:1200,
  //     car:'Honda City',
  //     attendees: [
  //       { id: 10, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
  //       { id: 11, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar4.png' },
  //       { id: 12, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar1.png' },
  //       { id: 14, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar5.png' },
  //     ],
  //     backgroundColor: '#e2caf8',
  //     titleColor: '#8a2be2',
  //   },
  //   {
  //     id: 4,
  //     title: 'Dummy Ride 4',
  //     startDate: '2023-05-19',
  //     endDate: '2023-05-19',
  //     startTime:"11:00 AM",
  //     endTime:"12:00 PM",
  //     status:'C',
  //     from:'Islamabad',
  //     to:'Lahore',
  //     capcaity:3,
  //     totalFare:500,
  //     car:'Honda City',
  //     attendees: [
  //       { id: 15, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
  //       { id: 16, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar4.png' },
  //       { id: 17, remoteImage: 'https://bootdey.com/img/Content/avatar/avatar6.png' },
  //     ],
  //     backgroundColor: '#d8e4fa',
  //     titleColor: '#6495ed',
  //   },
  //   // Add more appointments here
  // ]);

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
        <View style={styles.attendeesContainer}>
          {item.attendees.map((attendee) => (
            <Image key={attendee.id} source={{ uri: attendee.
            avatar }} style={styles.attendeeImage} />
          ))}
        </View>
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
      <Pressable onPress={() => 
        {AsyncStorage.removeItem('user')
        navigation.navigate('Home')}}>
        <Text style={tailwind`text-gray-50 font-bold`}>Logout</Text>
      </Pressable>
    </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View>
      <Text style={styles.allridestitle}>All Rides</Text>

      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={appointments.filter(searchFilter)}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id.toString()}
      />
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
    backgroundColor: '#000', // Set your desired background color
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
    paddingHorizontal:10
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
    backgroundColor:'#777',
    opacity:0.8,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
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
    paddingTop: 10,
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
});

export default AllRides;