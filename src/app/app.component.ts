import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
    // Hide navbar on auth pages
    this.isAuthPage = url.includes("/signin") || url.includes("/signup")
  }
}
