import * as ImagePicker from "expo-image-picker";
import { genShortId } from "./index";
export default async function uploadImage(mode) {
  if (mode === "camera") {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fetchUri = await fetch(result.assets[0].uri);
      const theBlob = await fetchUri.blob();
      console.log({
        imgID: genShortId(),
        ...result.assets[0],
      });
      return {
        imgID: genShortId(),
        ...result.assets[0],
      };
    }
  }
  return null;
}
