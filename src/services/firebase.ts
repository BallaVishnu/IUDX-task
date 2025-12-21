import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZetr6Mb5nwXKiwYTI_OCILYkg-H_ZtV8",
  authDomain: "consentapp-3f26d.firebaseapp.com",
  projectId: "consentapp-3f26d",
  storageBucket: "consentapp-3f26d.appspot.com",
  messagingSenderId: "1008990284332",
  appId: "1:1008990284332:web:995d59f7ea5fda9669bf89",
  measurementId: "G-H4GLW4EWPK",
};

if (!firebaseConfig.apiKey) {
  console.warn(
    "Firebase configuration is missing. Add EXPO_PUBLIC_FIREBASE_* environment variables to run authentication."
  );
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

