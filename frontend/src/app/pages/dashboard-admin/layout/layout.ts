import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-dashboard-admin-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class DashboardAdminLayout { }
