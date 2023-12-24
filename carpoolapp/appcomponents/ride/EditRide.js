import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Text, Pressable,StyleSheet,ScrollView } from "react-native";
import tailwind from "twrnc";
import { TextInput } from "../../components/text-input.tsx";
import { Button } from "../../components/button.tsx";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Add this import
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export const EditRide = (route) => {
    console.log("EditRide Console: ",route.route.params)
    const navigation = useNavigation();
    const {
        rideId,
        sDate,
        eDate,
        sTime,
        eTime,
        fLoc,
        tLoc,
        cap,
        tFare,
        carname,
        ridecategory
      } = route.route.params || {};
        
    const [startDate, setStartDate] = useState(new Date(sDate));
    const [endDate, setEndDate] = useState(new Date(eDate));
    const [startTime, setStartTime] = useState(new Date(`1970-01-01T${sTime}`)); // Use a common date (e.g., 1970-01-01) and append the time
    const [endTime, setEndTime] = useState(new Date(`1970-01-01T${eTime}`));      
    const [fromLoc, setFromLoc] = useState(fLoc);
    const [toLoc, setToLoc] = useState(tLoc);
    const [capacity, setCapacity] = useState(String(cap));
    const [totalFare, setTotalFare] = useState(tFare);
    const [car, setCar] = useState(carname);
    const [category, setCategory] = useState(ridecategory);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const categoryOptions = [
      { label: 'Male Only', value: 'M' },
      { label: 'Female Only', value: 'F' },
      { label: 'All', value: 'A' },
    ];
    
    // ... (rest of the component)
    const handleStartDateChange = (event, date) => {
        setShowStartDatePicker(false);
        if (date) {
          setStartDate(date);
        }
      };
    
      const handleEndDateChange = (event, date) => {
        setShowEndDatePicker(false);
        if (date) {
          setEndDate(date);
        }
      };
    
      const handleStartTimeChange = (event, date) => {
        setShowStartTimePicker(false);
        if (date) {
          setStartTime(date);
        }
      };
    
      const handleEndTimeChange = (event, date) => {
        setShowEndTimePicker(false);
        if (date) {
          setEndTime(date);
        }
      };
    

      function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }
      

    function formatTimeToHHMMSS(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${hours}:${minutes}:${seconds}`;
      }
      

  
    const handleRideUpdate = async () => {
      try {
        const formattedStartDate = formatDateToYYYYMMDD(startDate);
        const formattedEndDate = formatDateToYYYYMMDD(endDate);
        const formattedStartTime = formatTimeToHHMMSS(startTime);
        const formattedEndTime = formatTimeToHHMMSS(endTime);
  
        const response = await axios.put(`https://carpool-backend-rho.vercel.app/api/updaterides/${rideId}/`, {
        start_date:formattedStartDate,
        end_date:formattedEndDate,
        start_time:formattedStartTime,
        end_time:formattedEndTime,
        from_location:fromLoc,
        to_location:toLoc,
        capacity:capacity,
        total_fare:totalFare,
        car:car,
        category:category
        });
  
        if (response && response.data) {
          console.log('Ride Updated Successfully:', response.data);
          Toast.show({
            type: 'success',
            text1: 'Ride Updated Successfully',
            visibilityTime: 500,
            autoHide: true,
          });
          // Navigate back to the ride details page or any other page as needed
          navigation.navigate('RideDetails', { rideId: rideId, updatedRideDetails: response.data });
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error during ride update:', error.response?.data || error.message);
      }
    };

    return (
        <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Edit Your Ride</Text>
          {/* <Pressable onPress={() => { AsyncStorage.removeItem('user'); navigation.navigate('Home'); }}>
            <Text style={tailwind`text-gray-50 font-bold`}>Logout</Text>
          </Pressable> */}
        </View>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.card}>
          <View style={tailwind`px-2 w-full max-w-sm`}>
          <View style={tailwind`flex flex-col gap-4`}>
          <TextInput
                placeholder="Enter From Location"
                autoCapitalize="none"
                value={fromLoc} onChangeText={setFromLoc}
              />
              <TextInput
                placeholder="Enter To Location"
                autoCapitalize="none"
                value={toLoc} onChangeText={setToLoc}
              />
            {/* 
              <TextInput
                placeholder="Name this ride"
                autoCapitalize="none"
                value={title} onChangeText={setTitle}
              /> */}
             <Pressable onPress={() => setShowStartDatePicker(true)}>
                <TextInput
                  placeholder="Select Start Date"
                  autoCapitalize="none"
                  value={startDate.toLocaleDateString()} // Format the date
                  editable={false}
                />
              </Pressable>
              {showStartDatePicker && (
                <DateTimePicker
                  testID="startDatePicker"
                  value={startDate}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                />
              )}
              <Pressable onPress={() => setShowEndDatePicker(true)}>
                <TextInput
                  placeholder="Select End Date"
                  autoCapitalize="none"
                  value={endDate.toLocaleDateString()} // Format the date
                  editable={false}
                />
              </Pressable>
              {showEndDatePicker && (
                <DateTimePicker
                  testID="endDatePicker"
                  value={endDate}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                />
              )}
              <Pressable onPress={() => setShowStartTimePicker(true)}>
                <TextInput
                  placeholder="Select Start Time"
                  autoCapitalize="none"
                  value={startTime.toLocaleTimeString()} // Format the time
                  editable={false}
                />
              </Pressable>
              {showStartTimePicker && (
                <DateTimePicker
                  testID="startTimePicker"
                  value={startTime}
                  mode="time"
                  display="spinner"
                  onChange={handleStartTimeChange}
                />
              )}
              <Pressable onPress={() => setShowEndTimePicker(true)}>
                <TextInput
                  placeholder="Select End Time"
                  autoCapitalize="none"
                  value={endTime.toLocaleTimeString()} // Format the time
                  editable={false}
                />
              </Pressable>
              {showEndTimePicker && (
                <DateTimePicker
                  testID="endTimePicker"
                  value={endTime}
                  mode="time"
                  display="spinner"
                  onChange={handleEndTimeChange}
                />
              )}
    
              {/* text fields */}
              <TextInput
                placeholder="Enter Number of Riders Allowed"
                autoCapitalize="none"
                value={capacity} onChangeText={setCapacity}
              />
              <TextInput
                placeholder="Enter Total Fare to be split up between riders"
                autoCapitalize="none"
                value={totalFare} onChangeText={setTotalFare}
              />
              <TextInput
                placeholder="Enter Your Car Name"
                autoCapitalize="none"
                value={car} onChangeText={setCar}
              />
              <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Category:</Text>
              <Picker style={styles.picker} // Apply the styles here
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
              >
               {categoryOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
              </Picker>
            </View>
            </View>
    
            <View style={styles.buttonContainer}>
                <Button text="Update" variant="success" onPress={handleRideUpdate} />
            </View>    
           </View>
           </View>
    
          </ScrollView>
    
        </View>
      );

};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      paddingTop: 60,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#000', // Set your desired background color
    },
  
   
    scrollContentContainer: {
      padding: 10,
    },
    // ... (previous styles)
    buttonContainer: {
      marginTop: 20, // Add your desired top margin
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
        backgroundColor: '#eee',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        alignSelf:'center'
      },
      cardTitle: {
        fontSize:18,
        fontWeight: 'bold',
        paddingVertical: 5,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: -10,
        borderWidth:0.5,
      },
      buttonsContainer: {
        flexDirection: 'row',
      },
      actionButton: {
        marginTop:15,
        backgroundColor: '#DCDCDC',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
      },
      buttonText: {
        color: '#00008B',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        flex:1,
      },
      pickerContainer: {
        color:'#000',
        borderColor:'#000'
      },
      pickerLabel: {
        color: '#000',
        fontSize: 16,
        marginBottom: 5,
      },
      picker: {
        color: '#000', // Text color
        backgroundColor: '#fff', // Background color
        borderRadius: 10, // Border radius
        borderWidth: 2, // Border width
        borderColor: '#ccc', // Border color
        padding: 5, // Padding
      },
    });