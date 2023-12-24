import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const Dots = ({selected}) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View 
            style={{
                width:6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor
            }}
        />
    );
}

const Skip = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Next</Text>
    </TouchableOpacity>
);

const Done = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Done</Text>
    </TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => navigation.replace("Home")}
        onDone={() => navigation.navigate("Home")}
        pages={[
          {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/onboarding-img2.png')} />,
            title: 'Reach Everywhere Faster',
            subtitle: 'A New Way To Reach Your Destination',
          },
          {
            backgroundColor: '#fdeb93',
            image: <Image source={require('../../assets/onboarding-img2.png')} />,
            title: 'Connect To The World',
            subtitle: 'Connect with people and Start your journey',
          },
          {
            backgroundColor: '#e9bcbe',
            image: <Image source={require('../../assets/onboarding-img3.png')} />,
            title: 'You Decide The Rates',
            subtitle: "Let The Ride Begin",
          },
        ]}
      />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
