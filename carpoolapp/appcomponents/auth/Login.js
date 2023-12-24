import { View, Text, Pressable } from "react-native";
import tailwind from "twrnc";
import { TextInput } from "../../components/text-input.tsx";
import { Button } from "../../components/button.tsx";
import { PasswordReset } from "./ResetPassword.js";
import React, { useState, forwardRef } from "react";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



axios.defaults.withCredentials = true;
export const Login = forwardRef(({ navigation }, ref) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const fetchCsrfToken = async () => {
    try {
      // Make a request to the Django view that sets the CSRF token as a cookie
      const response = await axios.get('http://192.168.0.104:8000/api/get-csrf-token/');
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
  
  
  const handleLogin = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await axios.post(
        'http://192.168.0.104:8000/api/login/',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'X-CSRFTOKEN': csrfToken,
          },
        }
      );
  
      if (response && response.data) {
        // Store user object in AsyncStorage
        const resp = await axios.get(
          `http://192.168.0.104:8000/api/usersbyemail?email=${email}`
          );
        if(resp&&resp.data){
        console.log("Login Resp Data: ",resp.data)
        await AsyncStorage.setItem('user', JSON.stringify(resp.data));
        // Display success toast
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
        });
  
        // Navigate to the user profile page
        navigation.navigate('BottomNavbar'); // Adjust the screen name accordingly
      } else {
        console.error('Unexpected response format:', resp);
      }
   } } catch (error) {
      // Display error toast on login failure
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data || error.message || 'Unknown error',
      });
      console.error('Login failed:', error.response?.data || error.message || error);
    }
  };
  return (
    <View
      style={tailwind`flex-1 w-full items-center justify-center bg-gray-950`}
    >
      <View style={tailwind`px-4 w-full max-w-sm`}>
        <Text style={tailwind`text-5xl font-bold mb-6 text-gray-50`}>
          Login
        </Text>

        <View style={tailwind`flex flex-col gap-4`}>
          <TextInput placeholder="Enter email address" value={email} onChangeText={setEmail}/>
          <TextInput placeholder="Enter password"  secureTextEntry={!showPassword} value={password} onChangeText={setPassword}/>
        </View>

        <View style={tailwind`flex flex-row justify-between items-center my-8`}>
        <Pressable >
            <Text style={tailwind`text-gray-50 font-bold`}   onPress={() =>
        navigation.navigate('Signup')
      }>Sign Up</Text>
          </Pressable>
          <Pressable >
            <Text style={tailwind`text-gray-50 font-bold`}   onPress={() =>
        navigation.navigate('Passwordreset')
      }>Reset password</Text>
          </Pressable>
         
          
        </View>

        <Button text="Login" variant="success" onPress={handleLogin} />
      </View>
    </View>
  );
});