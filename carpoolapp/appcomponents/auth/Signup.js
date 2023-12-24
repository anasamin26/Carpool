import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Pressable } from "react-native";
import tailwind from "twrnc";
import { TextInput } from "../../components/text-input.tsx";
import { Button } from "../../components/button.tsx";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import axios from 'axios';

axios.defaults.withCredentials = true;


export const Signup = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(null); // Add state for gender


  const navigation = useNavigation();

  // ... (other state and functions)
  useImperativeHandle(ref, () => ({
    // Define the functions or values you want to expose
    clearFields: () => {
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
    },
  }));

  const fetchCsrfToken = async () => {
    try {
      // Make a request to the Django view that sets the CSRF token as a cookie
      const response = await axios.get('https://carpool-backend-rho.vercel.app/api/get-csrf-token/');
  
      // The CSRF token is automatically set as a cookie in the response
  
      // You can extract the CSRF token from the response headers if needed
      const csrfToken = response.headers['set-cookie'];
  
      console.log('CSRF Token:', csrfToken);
  
      return csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  };
  const handleSignup = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      console.log("Occupation: ",occupation)
      console.log("Gender: ",gender)
      const response = await axios.post('https://carpool-backend-rho.vercel.app/api/register/', {
        email:email,
        first_name: firstName,
        last_name: lastName,
        password:password,
        gender: gender, 
        occupation:occupation,
      },{
        headers: {
          'X-CSRFTOKEN': csrfToken, 
        },
      });

      if (response && response.data) {
        // User registered successfully
        console.log('User registered successfully:', response.data);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Registration Successful',
          visibilityTime: 1000,
          autoHide: true,
        });
        navigation.navigate('Home'); 

      } else {
        console.error('Unexpected response format:', response);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Registration Failed',
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error during registration',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const RadioButton = ({ label, value, selected, onSelect }) => {
    return (
      <>
      <Pressable
        style={tailwind`flex items-center justify-center bg-gray-50 h-6 w-6 rounded-sm`}
        onPress={onSelect}
               >
        {selected && <View style={tailwind`bg-green-400 h-4 w-4 rounded-sm`} />}
      </Pressable>
      <Text style={tailwind`text-gray-50`}>{label}</Text>
      </>
    );
  };
  
  
  
  return (
    <View
      style={tailwind`w-full flex-1 items-center justify-center bg-gray-950`}
    >
      {error ? (
        <View
          style={tailwind`absolute top-8 w-full bg-red-400 mx-8 max-w-sm p-4 rounded-md`}
        >
          <Text style={tailwind`text-gray-50 font-bold`}>
            Email addresses don't match
          </Text>
        </View>
      ) : null}
      <View style={tailwind`px-8 w-full max-w-sm`}>
        <Text style={tailwind`text-5xl font-bold mb-6 text-gray-50`}>
          Sign up
        </Text>
        <View style={tailwind`flex flex-col gap-4`}>
          <TextInput
            placeholder="Enter First Name"
            autoCapitalize="none"
            value={firstName} onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Enter Last Name"
            autoCapitalize="none"
            value={lastName} onChangeText={setLastName}
          />
          <TextInput
            placeholder="Occupation"
            autoCapitalize="none"
            value={occupation} onChangeText={setOccupation}
          />
          <View style={tailwind`flex-row items-center gap-4`}>
              <Text style={tailwind`text-gray-50`}>Gender:</Text>
              <RadioButton label="Male" value="M" selected={gender === 'M'} onSelect={() => setGender('M')} />
              <RadioButton label="Female" value="F" selected={gender === 'F'} onSelect={() => setGender('F')} />
              <RadioButton label="Others" value="O" selected={gender === 'O'} onSelect={() => setGender('O')} />
          </View>
          <TextInput
            placeholder="Enter email address"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email} onChangeText={setEmail}
          />
          <TextInput
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            value={password} onChangeText={setPassword}
          />
        </View>

        <View style={tailwind`flex-row items-center my-8`}>
          <Pressable
            style={tailwind`flex items-center justify-center bg-gray-50 h-6 w-6 rounded-sm mr-3`}
          >
            <View style={tailwind`bg-green-400 h-4 w-4 rounded-sm`} />
          </Pressable>
          <Text style={tailwind`text-gray-50`}>
            I've read and agree to the terms and conditions and the privacy
            policy
          </Text>
        </View>

        <Button text="Sign up" variant="success" onPress={handleSignup} />
      </View>
    </View>
  );
});