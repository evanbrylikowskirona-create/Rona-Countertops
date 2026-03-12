import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHGpgYCQv-E7NAdyy0F4h3ZUBNNNkU9gg",
  authDomain: "rona-auth.firebaseapp.com",
  projectId: "rona-auth",
  storageBucket: "rona-auth.firebasestorage.app",
  messagingSenderId: "869686402904",
  appId: "1:869686402904:web:586cbf2d88ca4e29e2cf2d"
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
getFirestore(app);
//# sourceMappingURL=firebase-B38L6PY_.js.map
