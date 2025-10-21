import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { app } from '../../config/firebase'

export async function pickImage(): Promise<string | null> {
    const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8
    })
    if (res.canceled) return null
    return res.assets?.[0]?.uri ?? null
}

export async function uploadImage(uri: string, userId = 'me'): Promise<string> {
    const storage = getStorage(app)
    const response = await fetch(uri)
    const blob = await response.blob()
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    const storageRef = ref(storage, `users/${userId}/images/${id}.jpg`)
    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
    return await getDownloadURL(storageRef)
}


