import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBZyQl-GbFLXFE8pg360WKx_ba8qiLITCc",
  authDomain: "supercoder-chat.firebaseapp.com",
  projectId: "supercoder-chat",
  storageBucket: "supercoder-chat.appspot.com",
  messagingSenderId: "594581355425",
  appId: "1:594581355425:web:8ab8abde9feb499d8769e0",
  measurementId: "G-Y1ZWE9BTQT"
};

const app = initializeApp(firebaseConfig);
export default app;