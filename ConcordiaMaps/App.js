import React, { useState, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screen/HomeScreen";
import { LocationProvider } from "./contexts/LocationContext";
import styles from "./styles";
import GetDirections from "./components/GetDirections";
import IndoorNavigation from "./components/IndoorNavigation"; // Import the new component

// Create Context for modal data and visibility
export const ModalContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    coordinate: { latitude: 0, longitude: 0 },
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <LocationProvider>
      <ModalContext.Provider
        value={{ isModalVisible, modalData, toggleModal, setModalData }}
      >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              style={styles.container}
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen name="GetDirections" component={GetDirections} />
            <Stack.Screen name="IndoorNavigation" component={IndoorNavigation} />
          </Stack.Navigator>
          
          
        </NavigationContainer>
      </ModalContext.Provider>
    </LocationProvider>
  );
}
