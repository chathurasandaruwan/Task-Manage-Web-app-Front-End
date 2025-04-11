import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  isAuthPage = false

  constructor(private router: Router) {}

  ngOnInit() {
    // Check the initial route
    this.checkIfAuthPage(this.router.url)

    // Subscribe to route changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.checkIfAuthPage(event.url)
    })
  }

  private checkIfAuthPage(url: string): void {
    // Hide navbar on auth 
    this.isAuthPage = url.includes("/signin") || url.includes("/signup") || url==="/"
  }
}
