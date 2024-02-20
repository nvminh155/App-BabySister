import React, { memo, useContext, useEffect, useRef } from "react";
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
import { AppImage, AppText, CustomButton } from "../../components";
import MapView, { Callout, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { COLORS } from "../../constants/COLORS";
import Spin from "../../components/Spin";
import { AuthContext } from "../../contexts/AuthProvider";

function ViewAddress({
  navigation,
  route,
  markers,
  setShowMap,
  onSelectAddress,
}) {
  console.log("🚀 ~ ViewAddress ~ markers:", markers);
  let [address, setAddress] = useState("");
  const [listAddress, setListAddress] = useState([]);
  const [timeOutRef, setTimeOutRef] = useState();
  const [selectAddress, setSelectAddress] = useState(null);
  const { yourLocation } = useContext(AuthContext);
  const mapRef = useRef(null);
  const [loadingMap, setLoadingMap] = useState(false);
  console.log("🚀 ~ MapScreen ~ selectAddress:", selectAddress);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates();
    }
  }, []);
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




  return (
    <View style={{ flex: 1 }}>
      {loadingMap ? (
        <Spin />
      ) : (
        <View id="map" style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            ref={mapRef}
            initialRegion={{
              ...yourLocation,
              latitude: markers[0].lat,
              longitude: markers[0].lon,
            }}
          >
            {markers.map((marker, i) => (
              <Marker
                key={i}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lon,
                }}
                title={`${marker.text} ${marker.distance ?? ""}` ?? ""}
                pinColor={marker.color ?? "red"}
              />
            ))}
          </MapView>
          <CustomButton
            label={"Đóng"}
            style={{
              backgroundColor: COLORS.accent,
              position: "absolute",
              right: 0,
              bottom: 20,
            }}
            onPress={() => {
              setShowMap(false)
            }}
          />
        </View>
      )}
    </View>
  );
}
export default memo(ViewAddress);
