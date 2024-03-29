import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from './core/services/auth/auth.service';
import { SessionService } from './core/services/session/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
  <li>
    <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" (click)="logout()">Deconnexion</a>
  </li>
`,
})
export class AppComponent implements OnInit {
  title = 'UniRide';
  isLoaded = false;


  constructor(private authService: AuthService, private sessionService: SessionService) {

  }


  ngOnInit(): void {
    initFlowbite();
    if (this.sessionService.checkAndStartSession()) {
      this.authService.setLoggedIn(this.authService.isAuthenticated())
      if (this.isLoggedIn()) {
        this.authService.getUserIDAndRole().subscribe({
          next: (data:any) => {
            sessionStorage.setItem('user_id', data.id);
            sessionStorage.setItem('user_r', data.role);
            this.isLoaded=true;
          },
          error: (err:any) => {
            console.log(err)
          }
        });
      }
      else {
        this.isLoaded=true;
      }
    }
    else {
      this.isLoaded=true;
    }


  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

}
