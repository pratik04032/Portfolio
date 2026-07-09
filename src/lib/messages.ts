import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestore-utils';

export async function submitContactMessage(name: string, email: string, message: string) {
  const pathForWrite = 'messages';
  try {
    const docRef = await addDoc(collection(db, pathForWrite), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
      status: 'new'
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, pathForWrite);
  }
}
