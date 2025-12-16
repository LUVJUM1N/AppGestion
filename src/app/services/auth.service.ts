import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged, updateProfile, User, signOut } from 'firebase/auth';
import { getStorage, Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth); // inyecta Auth correctamente
  private storage: Storage = inject(Storage);
  private firestore: Firestore = inject(Firestore);
  private zone = inject(NgZone);

  // Observable simple para el estado del usuario
  private authStateSubject = new BehaviorSubject<User | null>(this.auth.currentUser);
  authState$ = this.authStateSubject.asObservable();

  constructor() {
    // Mantener actualizado el estado del usuario
    onAuthStateChanged(this.auth, (user) => this.authStateSubject.next(user));
  }

  // Login con email y contraseña
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Registro de usuario nuevo
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Devuelve el usuario actual (sincrónico)
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Sube avatar a Firebase Storage con soporte de progreso, actualiza photoURL en el perfil y lo guarda en Firestore
  async uploadAvatar(file: File, onProgress?: (percent: number) => void): Promise<string> {
    const auth = getAuth();
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const storage = getStorage();
    const filePath = `avatars/${user.uid}/${file.name}`;
    const storageRef = ref(this.storage, `avatars/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(percent);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: url });
          // Guardar en Firestore
          try {
            await setDoc(doc(this.firestore, 'users', user.uid), {
              displayName: user.displayName ?? null,
              email: user.email ?? null,
              photoURL: url,
              updatedAt: serverTimestamp()
            }, { merge: true });
          } catch (e) {
            console.warn('No se pudo guardar usuario en Firestore', e);
          }
          // Emitir nuevo estado (el objeto user se actualiza in-place en la SDK)
          this.authStateSubject.next(user);
          resolve(url);
        });
    });
  }

  // Si el displayName no está establecido, lo fijamos usando la parte local del email
  async ensureDisplayNameFromEmail() {
    const user = this.auth.currentUser;
    if (!user || !user.email) return;
    const local = user.email.split('@')[0];
    if (!user.displayName || user.displayName !== local) {
      await updateProfile(user, { displayName: local });
      // Guardar también en Firestore
      try {
        await setDoc(doc(this.firestore, 'users', user.uid), {
          displayName: local,
          email: user.email ?? null,
          photoURL: user.photoURL ?? null,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('No se pudo guardar usuario en Firestore', e);
      }
      this.authStateSubject.next(user);
    }
  }

  // Actualiza el displayName y lo guarda en Firestore
  async updateDisplayName(newName: string): Promise<void> {
    const auth = getAuth();
    await updateProfile(auth.currentUser!, { displayName: newName });
    
    // Forzamos a Angular a reaccionar cuando Firebase termine
    this.zone.run(() => {
      console.log('Perfil actualizado en Firebase');
    });
  }

  // Cerrar sesión
  async signOut() {
    try {
      await signOut(this.auth);
      // Emitir nuevo estado
      this.authStateSubject.next(null);
    } catch (e) {
      console.warn('Error al cerrar sesión', e);
      throw e;
    }
  }
}