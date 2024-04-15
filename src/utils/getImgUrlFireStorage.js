import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/config";

export default async function(name) {
    return await getDownloadURL(ref(storage, `images/${name}`))
}