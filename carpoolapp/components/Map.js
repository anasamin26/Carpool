import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import tw from 'tailwind-react-native-classnames';

const Map = () => {
  const [origin, setOrigin] = useState({
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    description: 'This is the origin',
    identifier: 'origin',
  });

  return (
    <MapView
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: origin.location.latitude,
          longitude: origin.location.longitude,
        }}
        title={origin.title}
        description={origin.description}
        identifier={origin.identifier}
      />
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
