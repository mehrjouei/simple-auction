import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first, Observable, of, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  GoogleAuth(): Observable<any> {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider: any) {
    const credentials = new Subject();
    this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        credentials.next(result);
      })
      .catch((error) => {
        credentials.error(error);
      });

    return credentials.asObservable();
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      window.alert('Logged out!');
    });
  }

  public currentUser() {
    return this.afAuth.authState.pipe(first());
  }
}
