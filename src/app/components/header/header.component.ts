import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user!: User;
  subscriptions: Subscription = new Subscription();
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }

  loginWithGoogle() {
    this.authService.GoogleAuth();
  }

  logout() {
    this.authService.SignOut();
  }

  getUser() {
    this.subscriptions.add(
      this.authService.user.subscribe((_user) => {
        this.user = _user as User;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
