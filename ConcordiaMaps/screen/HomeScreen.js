import React from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles";
import MapMarkers from "../components/MapMarkers";
import { Building } from "../data/markersData";

function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Add Header and NavBar in the HomeScreen */}
      <Header />
      <NavBar /> {/* This is the navigation bar */}
      {/* Map view */}
      <MapView
        style={styles.map}
        showsUserLocation={true}
        loadingEnabled={true}
      >
        <MapMarkers markers={Building} />
      </MapView>
      {/* Footer */}
      <Footer />
    </View>
  );
}
export default HomeScreen;
