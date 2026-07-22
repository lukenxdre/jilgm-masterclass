// Your Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyDs2uHFnqORukE0o_DR91nXsuReF_2X7Ok",
  authDomain: "jilgm-masterclass.firebaseapp.com",
  projectId: "jilgm-masterclass",
  storageBucket: "jilgm-masterclass.firebasestorage.app",
  messagingSenderId: "41602432312",
  appId: "1:41602432312:web:6ab3c5b7a11fc0598cd5cd",
  measurementId: "G-GNTZNHWEP9"
};

// Check if a valid custom Firebase configuration is stored in localStorage
if (typeof window !== "undefined" && window.localStorage) {
  const storedConfigStr = window.localStorage.getItem('jilgm_firebase_config');
  if (storedConfigStr) {
    try {
      const parsed = JSON.parse(storedConfigStr);
      if (parsed && parsed.apiKey && parsed.projectId && parsed.appId) {
        firebaseConfig = parsed;
        console.log("Using custom Firebase configuration from storage in firebase.js");
      }
    } catch(err) {
      console.error("Error parsing stored Firebase config in firebase.js:", err);
    }
  }
}

export { firebaseConfig };



