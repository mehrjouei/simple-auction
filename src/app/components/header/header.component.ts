import { Component, OnInit, Optional } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getUser();  
  }

  loginWithGoogle() {
    this.authService.GoogleAuth().subscribe((res) => {
      console.log(res);
    });
  }

  logout() {
    this.authService.SignOut();
  }

  getUser() {
    this.authService.currentUser().subscribe((user) => {
      console.log('user=>>>', user);
    });
  }
}
