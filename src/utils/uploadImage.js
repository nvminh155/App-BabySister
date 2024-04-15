import * as ImagePicker from "expo-image-picker";
import { genShortId } from "./index";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import getImgUrlFireStorage from "./getImgUrlFireStorage";
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

      const shortIDD = genShortId();
      const storageRef = ref(getStorage(), `images/${shortIDD}`);
      await uploadBytes(storageRef, theBlob);
      return await getImgUrlFireStorage(shortIDD).then(url => {
        console.log({
          imgID: shortIDD,
          ...result.assets[0],
          urlFirebase: url,
        });
        return {
          imgID:shortIDD,
          ...result.assets[0],
          urlFirebase: url,
        };
      })
      
    }
  }
  return null;
}
