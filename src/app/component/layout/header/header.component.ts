import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  userName = 'John Doe';
  userAvatar = 'path/to/avatar.png';

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}
