import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';

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
export class Navbar implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  menuItems = [
    { icon: 'how_to_reg', label: 'Registration' , route: '/registration' },
    { icon: 'room_service', label: 'Service', route: '/service' },
    { icon: 'payments', label: 'Advance', route: '/advance' },
    { icon: 'logout', label: 'Checkout', route: '/checkout' },
    { icon: 'business', label: 'Corporate', route: '/corporate' },
    { icon: 'analytics', label: 'Status', route: '/status' },
    { icon: 'receipt_long', label: 'Payment', route: '/payment' },
    { icon: 'search', label: 'Search', route: '/search' },
    { icon: 'exit_to_app', label: 'Exit', route: '/exit' }
  ];

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}