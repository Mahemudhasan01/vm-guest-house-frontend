import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CheckInService } from '../../services/check-in-service';
import { CheckOutService } from '../../services/check-out-service';
// import { SaasDocsDialog } from './saas-docs-dialog';

@Component({
  selector: 'app-check-out-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './check-out-list.html',
  styleUrl: './check-out-list.css',
})
export class CheckOutList implements OnInit{
  
  checkOutList: any[] = [];
  selectedGuest: any;
  numberOfCheckout: number = 0;
  constructor(
    private checkOutService: CheckOutService,
    private snackBar: MatSnackBar,
    private checkInService: CheckInService,
  ) {}
  ngOnInit(): void {
    this.loadCheckOutList();
  }

  loadCheckOutList(): void {
    const params: any = {
      page: 0,
      size: 20,
      sortBy: 'createdDateTime,ASC'
    };

    this.checkInService.getAll(params).subscribe({
      next: (response: any) => {
        this.checkOutList = response.data.data.map((item: any) => ({
          ...item,
          stayCount: this.calculateStayDays(item.checkInDate, item.checkInTime)
        }));
        this.numberOfCheckout = this.checkOutList.length;
      },
      error: (error: any) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  calculateStayDays(checkInDate: any, checkInTime: any) {
    const checkInDateTime = new Date(`${checkInDate}T${checkInTime}`);
    const currentDateTime = new Date();

    const timeDifference =
      currentDateTime.getTime() - checkInDateTime.getTime();

    const stayCount = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24)
    );

    return Math.max(1, stayCount);
  }

  showDetails = signal(false);
  isCheckoutConfirmed = signal(false);

  openCheckoutDetails(id?: string) {
    this.selectedGuest = this.checkOutList.find((item) => item.id === id);

    this.showDetails.set(true);
    this.isCheckoutConfirmed.set(false);
  }

  closeCheckoutDetails() {
    this.showDetails.set(false);
    this.isCheckoutConfirmed.set(false);
  }

  confirmCheckout() {
    this.isCheckoutConfirmed.set(true);
  }
}
