import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/config";

export default async function(name) {
    await getDownloadURL(ref(storage, `images/${name}`))
      .then((url) => {
        console.log("🚀 ~ .then ~ url:", url)
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = "blob";
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open("GET", url);
        // xhr.send();

        // Or inserted into an <img> element
       return url;
      })
      .catch((error) => {
        // Handle any errors
        console.log(error)
        return error
      });
}