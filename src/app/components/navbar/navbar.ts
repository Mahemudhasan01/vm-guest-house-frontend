import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  menuItems = [
    { icon: 'how_to_reg', label: 'Registration' },
    { icon: 'room_service', label: 'Service' },
    { icon: 'payments', label: 'Advance' },
    { icon: 'logout', label: 'Checkout' },
    { icon: 'business', label: 'Corporate' },
    { icon: 'analytics', label: 'Status' },
    { icon: 'receipt_long', label: 'Payment' },
    { icon: 'search', label: 'Search' },
    { icon: 'exit_to_app', label: 'Exit' }
  ];
}