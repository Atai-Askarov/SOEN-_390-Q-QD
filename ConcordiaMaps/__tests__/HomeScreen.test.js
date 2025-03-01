import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import axios from "axios";
import HomeScreen from "../screen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { ModalContext } from "../App";
import { LocationContext } from "../contexts/LocationContext";

jest.mock("axios");

describe("HomeScreen", () => {
  const mockLocation = { latitude: 45.4973, longitude: -73.5789 };
  const mockToggleModal = jest.fn();
  const mockSetModalData = jest.fn();

  const renderComponent = () =>
    render(
      <NavigationContainer>
        <ModalContext.Provider
          value={{
            toggleModal: mockToggleModal,
            setModalData: mockSetModalData,
          }}
        >
          <LocationContext.Provider value={{ location: mockLocation }}>
            <HomeScreen />
          </LocationContext.Provider>
        </ModalContext.Provider>
      </NavigationContainer>
    );

  it("renders the map correctly on successful API call", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            geometry: { location: { lat: 45.4973, lng: -73.5789 } },
          },
        ],
        status: "OK",
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId("map-view")).toBeTruthy();
    });
  });

  it("handles marker press event", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            geometry: { location: { lat: 45.4973, lng: -73.5789 } },
          },
        ],
        status: "OK",
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      fireEvent.press(getByTestId("marker-0"));
    });

    expect(mockSetModalData).toHaveBeenCalled();
    expect(mockToggleModal).toHaveBeenCalled();
  });

  it("displays an error message when location is not found", async () => {
    axios.get.mockResolvedValueOnce({
      data: { results: [], status: "ZERO_RESULTS" },
    });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId("error-message").props.children).toBe("ZERO_RESULTS");
    });
  });

  it("return error if no results found", async () => {
    axios.get.mockResolvedValueOnce({
      data: { results: [], status: "OK" },
    });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId("error-message").props.children).toBe(
        "No results found."
      );
    });
  });

  it("handles change campuses event", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            geometry: { location: { lat: 45.4973, lng: -73.5789 } },
          },
        ],
        status: "OK",
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      fireEvent.press(getByTestId("change-campus-button"));
    });

    expect(mockSetModalData).toHaveBeenCalled();
    expect(mockToggleModal).toHaveBeenCalled();
  });
});
