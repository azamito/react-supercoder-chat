import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  doc
} from "firebase/firestore";

import app from './';

// Firestore db
export const db = getFirestore(app)

// Ambil Data Contact dari collecction profiles
export const getContact = () => {
  return collection(db, 'profiles');
}

// Tambahkan Data Chat ke collecction chats
export const addChat = (data) => {
  const docRef = addDoc(collection(db, "chats"), data);
  return docRef;
}

// Ambil Data Chat dari collecction chats
export const getChat = (uid) => {
  const docRef = collection(db, 'chats');
  const result = query(docRef, where("user_ids", "array-contains", uid), orderBy("updated_at", "desc"));
  return result;
}

// Ambil data dari dokumen colection chat
export const getChatDoc = (chatId) => {
  const docRef = doc(db, "chats", chatId);
  return docRef;
}
