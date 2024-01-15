import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  constructor(private router: Router) { }

  redirectionDiscord() {
    window.location.href = 'https://discord.gg/29En8s8qPT';
  }
}