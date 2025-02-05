import React from "react";
import { Polygon, Marker } from "react-native-maps";
import { Building } from "../data/markersData copy.js"; // Adjust path as needed

const BuildingColoring = () => {
  return (
    <>
      {Building.features.map((feature, index) => {
        const { geometry, properties } = feature;

        if (geometry.type === "Polygon") {
          const coordinates = geometry.coordinates[0].map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));

          return (
            <Polygon
              key={index}
              coordinates={coordinates}
              fillColor="rgba(255, 0, 0, 0.5)"
              strokeColor="rgba(255, 0, 0, 1)"
              strokeWidth={1}
            />
          );
        }

        if (geometry.type === "Point") {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: geometry.coordinates[1],
                longitude: geometry.coordinates[0],
              }}
              title={properties.name}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export default BuildingColoring;
