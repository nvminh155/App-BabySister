import React, { memo, useContext, useEffect } from "react";
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
import { AppText, CustomButton } from "../../components";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { COLORS } from "../../constants/COLORS";
import Spin from "../../components/Spin";
import { AuthContext } from "../../contexts/AuthProvider";

function SelectAddress({
  navigation,
  route,
  onSelectAddress,
  setShowMap,
  placeholderInput
}) {
  let [address, setAddress] = useState("");
  const [listAddress, setListAddress] = useState([]);
  const [timeOutRef, setTimeOutRef] = useState();
  const [selectAddress, setSelectAddress] = useState(null);
  const {yourLocation} = useContext(AuthContext);
  const [loadingMap, setLoadingMap] = useState(false);
  console.log("🚀 ~ MapScreen ~ selectAddress:", selectAddress);



  useEffect(() => {
    if (yourLocation) {
      const timeref = setTimeout(() => {
        setLoadingMap(false);
      }, 2000);

      return () => {
        clearTimeout(timeref);
      };
    }
  }, [yourLocation]);
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
    <View style={{ flex: 1 }}>
      <View style={{ position: "relative" }}>
        <View>
          <TextInput
          placeholder={placeholderInput}
            onChangeText={handleSearchAddress}
            value={address}
            style={{
              borderColor: "red",
              borderWidth: 2,
              paddingLeft: 10,
              paddingVertical: 3,
            }}
          ></TextInput>
          {/* <Button title="Set Center" onPress={onButtonPress}></Button> */}
        </View>
        {listAddress && listAddress.length > 0 && (
          <ScrollView
            style={{ rowGap: 15, maxHeight: 200 }}
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
                      text: v.formatted,
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

      {loadingMap ? (
        <Spin />
      ) : (
        <View id="map" style={{ flex: 1 }}>
          {yourLocation && (
            <MapView
              style={{ flex: 1 }}
              region={selectAddress ?? yourLocation}
            >
              <Marker
                coordinate={{
                  latitude: selectAddress?.latitude ?? yourLocation.latitude,
                  longitude:
                    selectAddress?.longitude ?? yourLocation.longitude,
                }}
              ></Marker>
            </MapView>
          )}

          <View style={{ position: "absolute", bottom: 15, right: 0 }}>
            <CustomButton
              label={"Xác Nhận"}
              style={{ backgroundColor: COLORS.accent }}
              onPress={() => {
                onSelectAddress({
                  lon: selectAddress.longitude,
                  lat: selectAddress.latitude,
                  text: selectAddress.text,
                  latDelta: 0.0922,
                  lonDelta: 0.0421,
                });
                setShowMap(false);
              }}
            />
            <CustomButton
              label={"Hủy"}
              style={{
                backgroundColor: COLORS.secondary,
                borderColor: COLORS.accent,
                borderWidth: 1,
              }}
              styleText={{ color: COLORS.accent }}
              onPress={() => {
                setShowMap(false);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
export default memo(SelectAddress)
