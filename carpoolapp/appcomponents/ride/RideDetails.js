import React, { useEffect, useState,useRef} from 'react';
import { View, Text, Image, StyleSheet, FlatList ,TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import  {LinearGradient}  from 'expo-linear-gradient'
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const OrganizerDetailsTable = ({ rideDetails }) => {
  const detailsData = [
    { label: 'Date', value: rideDetails.start_date },
    { label: 'Time', value: `${rideDetails.start_time}` },
    { label: 'Capacity', value: rideDetails.capacity },
    { label: 'Total Fare', value: rideDetails.total_fare },
    { label: 'Car', value: rideDetails.car },
  ];  
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.tableHeader]}>Details</Text>
        <Text style={[styles.tableCell, styles.tableHeader]}>Values</Text>
      </View>
      {detailsData.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.detailsCell]}>{item.label}</Text>
          <Text style={styles.tableCell}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};
const RideDetailsScreen = ({ route }) => {
  const navigation = useNavigation(); 
  const { rideId, updatedRideDetails } = route.params;
  const [rideDetails, setRideDetails] = useState(null);
  const [loggedInUser,setLoggedInUser]=useState(null)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const handleDeletePress = () => {
    // Show the delete confirmation modal
    setDeleteModalVisible(true);
  };

     const handleDeleteConfirmed = async () => {
    try {
      if (loggedInUser) {
        await axios.delete(
          'https://carpool-backend-rho.vercel.app/api/delete_ride/',
          {
            params: {
              rideId: rideDetails.id,
              userId: loggedInUser.id,
            },
          }
        );
  
        // If the axios.delete call is successful, execute the following actions
        Toast.show({
          type: 'success',
          text1: 'Ride deleted successfully',
        });
        setDeleteModalVisible(false);
        navigation.navigate('BottomNavbar');
      }
    } catch (error) {
      // If there's an error in the axios.delete call, handle the error
      Toast.show({
        type: 'error',
        text1: 'Failed to delete the ride',
        text2: error.response?.data || error.message || 'Unknown error',
      });
      console.error('Error deleting the ride:', error.response?.data || error.message || error);
      setDeleteModalVisible(false);
      navigation.navigate('BottomNavbar');
    }
  };
  

  const handleDeleteCancelled = () => {
    // Close the modal if the deletion is cancelled
    setDeleteModalVisible(false);
  };

  const handleButtonPress = async () => {
    if (isUserInAttendees) {
      // User is already in attendees, handle cancel request logic
      try {
        const response = await axios.post(
          `https://carpool-backend-rho.vercel.app/api/rides/${rideId}/cancel/`,
          {
            id: parseInt(loggedInUser.id),
          }
        );

        if (response && response.data) {
          Toast.show({
            type: 'success',
            text1: 'Canceled the ride request successfully',
          });
          setRideDetails(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to cancel the ride request',
          text2: error.response?.data || error.message || 'Unknown error',
        });
        console.error('Error canceling the ride request:', error.response?.data || error.message || error);
      }
    } else {
      try {
        const response = await axios.post(
          `https://carpool-backend-rho.vercel.app/api/rides/${rideId}/join/`,
          {
            id: parseInt(loggedInUser.id),
          }
        );
        if (response && response.data) {
          Toast.show({
            type: 'success',
            text1: 'Joined the ride successfully',
          });
          setRideDetails(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to join the ride',
          text2: error.response?.data || error.message || 'Unknown error',
        });
        console.error('Error joining the ride:', error.response?.data || error.message || error);
      }
    }
  };
  const handleCancelButtonPress = async () => {
    try {
      const response = await axios.post(
        `https://carpool-backend-rho.vercel.app/api/rides/${rideId}/cancel/`,
        {
          id: parseInt(loggedInUser.id),
        }
      );

      if (response && response.data) {
        Toast.show({
          type: 'success',
          text1: 'Canceled the ride request successfully',
        });
        setRideDetails(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to cancel the ride request',
        text2: error.response?.data || error.message || 'Unknown error',
      });
      console.error('Error canceling the ride request:', error.response?.data || error.message || error);
    }
  };


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
  }, []);

  useEffect(() => {
    const apiEndpoint = `https://carpool-backend-rho.vercel.app/api/rides/${rideId}/`;
    axios.get(apiEndpoint)
      .then(response => {
        setRideDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching ride details:', error);
      });
  }, [rideId]);

  useEffect(() => {
    if (updatedRideDetails) {
      setRideDetails(updatedRideDetails);
    }
  }, [updatedRideDetails]);

  if (!rideDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

 
  const isUserInAttendees = rideDetails?.attendees.some(
    (attendee) => attendee.id === loggedInUser?.id
  );

  const isUserOrganizer = rideDetails?.organizer_id == loggedInUser?.id;
 
  const renderHeader = () => {

    return(
    <LinearGradient
    colors={['#ADA996','#F2F2F2','#DBDBDB','#EAEAEA']}
    style={{flex:1,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      marginBottom: 16,
      padding: 16,}}
  >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organizer Details</Text>
      </View>
      <View style={styles.body}>
        <Image source={{ uri: rideDetails.organizer_image || 'https://bootdey.com/img/Content/avatar/avatar6.png' }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{rideDetails.organizer}</Text>
          <Text style={styles.userRole}>{rideDetails.organizer_occupation}</Text>
        </View>
      </View>
      <Text style={styles.cardContentLoc}>{rideDetails?.from_location || 'Ride Title'} - {rideDetails.to_location}</Text>
      <OrganizerDetailsTable rideDetails={rideDetails} />
    </LinearGradient>)
  };

  const renderClassItem = ({ item }) => (
    <View style={styles.classItem}>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineLine} />
      </View>

      <View style={styles.classContent}>
            <View style={styles.classHours}>
            <Text style={styles.startTime}>{item.id}</Text>
            </View>

            <LinearGradient
              colors={['#ADA996','#ccc','#999','#888']}
              style={{flex:1,
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
                marginBottom: 16,
                padding: 16,}}
            >           
     <Image source={{ uri: item.avatar || 'https://bootdey.com/img/Content/avatar/avatar6.png' }} style={styles.avatar} />
            <Text style={styles.cardTitle}>{item.first_name}</Text>
            <Text style={styles.cardContent}>{item.occupation}</Text>
</LinearGradient> 
     </View>
    </View>
  );

  const handleEditButtonPress = () => {
    console.log('handleEditButtonPress');
    console.log("RideDetails: ",rideDetails)
    if(rideDetails){
    navigation.navigate('EditRide',
     { rideId: rideDetails.id,sDate:rideDetails.start_date,eDate:rideDetails.end_date,
    sTime:rideDetails.start_time,eTime:rideDetails.end_time,fLoc:rideDetails.from_location,tLoc:rideDetails.to_location,
    cap:rideDetails.capacity,tFare:rideDetails.total_fare,carname:rideDetails.car,ridecategory:rideDetails.category
    }
    )}
  }
  
  return (
      <View style={styles.container}>
      <Text style={styles.title}>Ride Details</Text>
      <FlatList
      contentContainerStyle={{paddingHorizontal:16}}
         data={rideDetails?.attendees || []}      
        ListHeaderComponent={renderHeader}
        renderItem={renderClassItem}
        keyExtractor={(attendee) => attendee.id.toString()}     
         />  

     {
     isUserInAttendees && !isUserOrganizer ?(
        <TouchableOpacity onPress={handleCancelButtonPress} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Request</Text>
        </TouchableOpacity>
      ) : !isUserInAttendees && !isUserOrganizer ?
       (
        <TouchableOpacity onPress={handleButtonPress} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Ride</Text>
        </TouchableOpacity>    
     )
     : !isUserInAttendees && isUserOrganizer ?(
      <View style={styles.editDeleteContainer}>
      <TouchableOpacity onPress ={handleEditButtonPress} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
     ):(
      <View/>
     )
     }
     <Modal isVisible={isDeleteModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <Text>Are you sure you want to delete?</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={handleDeleteConfirmed} style={{ marginRight: 10 }}>
                <Text style={{ color: 'green' }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteCancelled} style={{ marginLeft: 10 }}>
                <Text style={{ color: 'red' }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex:1,
      paddingTop: 60,
      backgroundColor: "#000",
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      marginLeft:16,
      color: "#fff",
    },
    card: {
      flex:1,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      marginBottom: 16,
      padding: 16,
    },
    header: {
      marginBottom: 8,
    },
    headerTitle: {
      color:'#222',
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      fontSize: 12,
      color:'#222',
    },
    body: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 8,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#222',
    },
    userRole: {
      fontSize: 12,
      color:'#222',
    },
    classItem: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
    timelineContainer: {
      width: 30,
      alignItems: 'center',
      
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#ff7f50',
      marginBottom: 8,
    },
    timelineLine: {
      flex: 1,
      width: 2,
      backgroundColor: '#ff7f50',
    },
    classContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,

    },
    classHours: {
      marginRight: 8,
      alignItems: 'flex-end',
    },
    startTime: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color:"#ff7f50"
    },
    endTime: {
      fontSize: 16,
    },
    cardTitle: {
      fontSize: 16,
      color: '#00008B',
      marginBottom: 4,
    },
    cardDate: {
      fontSize: 12,
      color: '#00008B',
      marginBottom: 8,
    },
    studentListContainer:{
      marginRight:10,
    },
    studentAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: -3,
      borderWidth:1,
      borderColor:'#fff'
    },
  
  attendeeAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -3,
    borderWidth: 1,
    borderColor: '#fff',
  },
  joinButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardContentLoc:{
    alignItems:'center',
    alignSelf:'center',
    fontSize: 20,
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:10,
    fontWeight: 'bold',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    justifyContent:'center'

  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign:'center',
    justifyContent:'center'


  },
  tableCell: {
    flex: 1,
    padding: 10,
    color: '#000',
    textAlign:'center'
  },
  detailsCell: {
    width: 120, // Set a fixed width for the "Details" column
    fontWeight:'bold'
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#000', // Background color for header cells
    color:'#fff',
    textAlign:'center',
    fontSize:16
  },
  editDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:350,
    height:50,
    alignSelf:'center',
    marginBottom:10
  },
  
  editButton: {
    flex: 1, // Equal flex for both buttons to share the space
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 3, // Adjust margin as needed
  },
  
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  deleteButton: {
    flex: 1, // Equal flex for both buttons to share the space
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 3, // Adjust margin as needed
   },

  
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RideDetailsScreen;

