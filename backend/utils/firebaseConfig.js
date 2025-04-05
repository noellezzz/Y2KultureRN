import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
firebaseCredentials.private_key = firebaseCredentials.private_key.replace(
  /\\n/g,
  "\n"
);

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
});

export default admin;
