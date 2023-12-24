import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, View, Text, Pressable, Image } from "react-native";
import tailwind from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Avatar } from "../../components/avatar.tsx";

const Tab = createBottomTabNavigator();

const SettingsScreen = () => (
  <View style={tailwind`flex-1 items-center justify-center gap-8`}>
    {/* Add your settings content here */}
    <Text style={tailwind`text-gray-50 text-lg`}>Settings</Text>
  </View>
);

const HelpScreen = () => (
  <View style={tailwind`flex-1 items-center justify-center gap-8`}>
    {/* Add your help content here */}
    <Text style={tailwind`text-gray-50 text-lg`}>Help</Text>
  </View>
);

const UserProfileScreen = () => (
  <View style={tailwind`flex-1 items-center justify-center gap-8`}>
    {/* Add your user profile content here */}
    <Text style={tailwind`text-gray-50 text-3xl font-bold`}>Joe Bloggs</Text>
    <Text style={tailwind`text-gray-50 text-lg`}>joe@bloggs.com</Text>
  </View>
);

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
    name="UserProfileScreen"
    component={SettingsScreen}
    options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="settings-outline" size={size} color={color} />
      ),
    }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Help"
      component={HelpScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="help-buoy-outline" size={size} color={color} />
        ),
      }}
    />
    
  </Tab.Navigator>
);

export const UserProfile = ({ navigation }) => {
  const handleLogout = () => {
    // Perform any logout logic here
    // For now, let's navigate back to the Login screen
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={tailwind`w-full flex-1 bg-gray-950`}>
      <View style={tailwind`flex-1 items-center justify-center gap-8`}>
        <Avatar source={{ uri: "https://source.unsplash.com/random" }} />
        <View style={tailwind`gap-2 items-center`}>
          <Text style={tailwind`text-gray-50 text-3xl font-bold`}>
            Joe Bloggs
          </Text>
          <Text style={tailwind`text-gray-50 text-lg`}>joe@bloggs.com</Text>
        </View>
      </View>
      <BottomTabNavigator />
      <Pressable
        style={tailwind`flex-row items-center gap-2 px-8`}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text style={tailwind`text-gray-50 text-lg`}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};