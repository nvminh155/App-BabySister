import React, { useEffect } from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { COLORS } from "../../constants/COLORS";

export default function MapScreen({navigation, route, markers}) {
  let [address, setAddress] = useState("");
  const [listAddress, setListAddress] = useState([]);
  const [timeOutRef, setTimeOutRef] = useState();
  const [selectAddress, setSelectAddress] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  console.log("🚀 ~ MapScreen ~ selectAddress:", selectAddress);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [currentLocation]);

  const fetchAddress = async (text) => {
    await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=029befe4af94401bb7ce56edd58af612
    `)
      .then((res) => res.json())
      .then((res) => {
        setListAddress(res.results);
      });
  };

  const handleSearchAddress = (text) => {
    clearTimeout(timeOutRef);
    setTimeOutRef(
      setTimeout(() => {
        fetchAddress(text);
      }, 1500)
    );
    setAddress(text);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{position: 'relative'}}>
        <View>
          <TextInput
            onChangeText={handleSearchAddress}
            value={address}
            style={{ borderColor: "red", borderWidth: 2 }}
          ></TextInput>
          {/* <Button title="Set Center" onPress={onButtonPress}></Button> */}
        </View>
        {listAddress && listAddress.length > 0 && (
          <ScrollView
            style={{ rowGap: 15, maxHeight: 200,}}
            contentContainerStyle={{ rowGap: 15 }}
          >
            {listAddress &&
              listAddress.map((v, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ backgroundColor: COLORS.accent }}
                  onPress={() => {
                    console.log(v);
                    setSelectAddress({
                      longitude: v.bbox.lon1,
                      latitude: v.bbox.lat1,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    });
                  }}
                >
                  <AppText>{v.formatted}</AppText>
                  <AppText>{v.bbox.lon1}</AppText>
                  <AppText>{v.bbox.lat1}</AppText>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </View>

      {currentLocation && (
        <MapView style={{ flex: 1 }} region={selectAddress ?? currentLocation}>
          <Marker
            coordinate={{
              latitude: selectAddress?.latitude ?? currentLocation.latitude,
              longitude: selectAddress?.longitude ?? currentLocation.longitude,
            }}
          ></Marker>
        </MapView>
      )}
    </SafeAreaView>
  );
}
