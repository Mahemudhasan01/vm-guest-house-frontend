import { Component, inject, computed, signal, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room';
import { RoomCard } from '../room-card/room-card'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GuestFormDialog } from '../guest-form-dialog/guest-form-dialog'; 
import { Room, RoomStatus } from '../../models/room.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { animate, stagger } from "motion";

@Pipe({
  name: 'filterByFloor',
  standalone: true
})
export class FilterByFloorPipe implements PipeTransform {
  transform(rooms: Room[], floor: number): Room[] {
    return rooms.filter(r => r.floor === floor);
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RoomCard,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FilterByFloorPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {

  roomService = inject(RoomService);
  private dialog = inject(MatDialog);

  searchQuery = signal('');

  activities = [
    { id: 1, room: '101', action: 'Check-in', guest: 'A. Sharma', time: '10 mins ago' },
    { id: 2, room: '201', action: 'Service', guest: 'Breakfast Served', time: '45 mins ago' },
    { id: 3, room: '114', action: 'Checkout', guest: 'Complete', time: '2 hours ago' },
    { id: 4, room: '105', action: 'Payment', guest: 'Received', time: '3 hours ago' },
    { id: 5, room: '305', action: 'Check-in', guest: 'K. Verma', time: '5 hours ago' }
  ];

  filteredRooms = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const rooms = this.roomService.rooms();

    if (!query) return rooms;

    return rooms.filter(r =>
      r.roomNumber.includes(query) ||
      r.guest?.fullName.toLowerCase().includes(query) ||
      r.guest?.city.toLowerCase().includes(query)
    );
  });

  ngAfterViewInit() {
    this.animateEntrance();
  }

  animateEntrance() {
    const rooms = document.querySelectorAll('.animate-room');
    animate(
      rooms,
      { opacity: [0, 1], scale: [0.9, 1], y: [20, 0] },
      {
        delay: stagger(0.01),
        duration: 0.5,
        ease: "easeOut"
      }
    );
  }

  openBookingDialog(room: Room) {

    const dialogRef = this.dialog.open(GuestFormDialog, {
      width: '95vw',
      maxWidth: '1400px',
      height: '95vh',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-dialog-container',
      data: { room }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.updateRoomStatus(
          room.roomNumber,
          RoomStatus.OCCUPIED,
          result
        );
      }
    });
  }
}