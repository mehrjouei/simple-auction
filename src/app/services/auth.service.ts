import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, first, Observable, of, Subject, take } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: BehaviorSubject<User | null> = new BehaviorSubject(
    null as any
  );

  public get user() {
    return this._user;
  }

  constructor(
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.currentUser().subscribe((user) => {
      this._user.next(user as User);
    });
  }

  GoogleAuth(): Observable<any> {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider: any) {
    const credentials = new Subject();
    this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this._user.next(result.user as User);
        credentials.next(result);
        this.addOrUpdate(result.user as User);
      })
      .catch((error) => {
        credentials.error(error);
      });
    return credentials.asObservable();
  }

  addOrUpdate(loggedInUser: User) {
    this.firestore
      .doc(`users/${loggedInUser.uid}`)
      .get()
      .subscribe((user) => {
        if (user.exists) {
          this.updateUser(loggedInUser);
        } else {
          this.addUser(loggedInUser);
        }
      });
  }

  updateUser(freshData: User) {
    this.firestore.doc(`users/${freshData.uid}`).update({
      displayName: freshData.displayName,
      email: freshData.email,
      emailVerified: freshData.emailVerified,
      photoURL: freshData.photoURL,
    });
  }

  addUser(newUser: User) {
    this.firestore
      .collection('users')
      .doc(newUser.uid)
      .set({
        displayName: newUser.displayName,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        photoURL: newUser.photoURL,
      } as User);
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      this._user.next(null as any);
    });
  }

  public currentUser() {
    return this.afAuth.authState.pipe(first());
  }
}
