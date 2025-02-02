import React, { useState, useEffect} from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import axios from "axios";
import MapView from "react-native-maps";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
function HomeScreen() {

  const [postalCode, setPostalCode] = useState('H3G 1M8');
        const [coordinates, setCoordinates] = useState(null);
        const [error, setError] = useState('');
        const loyolaPostalCode = 'H4B 1R6';
        const sgwPostalCode = 'H3G 1M8';
        
        const convertToCoordinates = async (postal_code) => {
            const key = "AIzaSyAW8gOP1PJiZp1br3kOPSlRYdPlDoGkkR4";
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${postal_code}&key=${key}`);
                const { status, results } = response.data;
    
                
                if (status === 'OK') {
                    if (results.length > 0) {
                        const { lat, lng } = results[0].geometry.location;
                        setCoordinates({ latitude: lat, longitude: lng });
                        setError('');
                    } else {
                        setCoordinates(null);
                        setError('No results found.');
                    }
                } else {
                    setCoordinates(null);
                    setError(`Error: ${status}`);
                }
            } catch (error) {
                console.error('Error:', error);
                setCoordinates(null);
                setError('Something went wrong. Please try again later.');
            }
            
            
        };
        
        useEffect(() => {
            convertToCoordinates(postalCode);

      }, [postalCode]); 

      const handleButtonPress = () => {
        setPostalCode(prevPostalCode => prevPostalCode === sgwPostalCode ? loyolaPostalCode : sgwPostalCode);
    };

  return (
    <View style={styles.container}>
    <Header />
    <Button title={postalCode} onPress={handleButtonPress} />
    {coordinates ? (
      <>
        <Text>Coordinates: {coordinates.latitude}, {coordinates.longitude}</Text>
        <MapView
          style={styles.map}
          region={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.01, // Adjusted for a balance between close zoom and larger area
              longitudeDelta: 0.01,
          }}
        />
      </>
    ) : (
      <Text>Loading...</Text>
    )}
    {error ? <Text>Error: {error}</Text> : null}
    <NavBar />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#912338",
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
