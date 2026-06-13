import { Component, inject, computed, signal, AfterViewInit, Pipe, PipeTransform, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomCard } from '../room-card/room-card'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GuestFormDialog } from '../guest-form-dialog/guest-form-dialog'; 
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { animate, stagger } from "motion";
import { RoomService } from '../../services/room-service';

@Pipe({
  name: 'filterByFloor',
  standalone: true
})
  export class FilterByFloorPipe implements PipeTransform {
    transform(rooms: any[], floorNo: number): any[] {
      return rooms.filter(r => r.floorNo === floorNo);
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
export class Dashboard implements OnInit{

  // roomService = inject(RoomService);
  private dialog = inject(MatDialog);
  rooms: any[] = [];
  floors: any[] = [];

  constructor(
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    const payload = {
      page: 0,
      size: 100
    }; // Add any necessary parameters here

    this.roomService.getAllRooms(payload).subscribe({
      next: (response: any) => {
        this.rooms = response.data.data ?? [];

        this.floors = [
          ...new Set(
            this.rooms
              .filter(room => room.floorNo != null)
              .map(room => room.floorNo)
          )
        ].sort((a, b) => a - b);

        console.log('Rooms:', this.rooms);
        console.log('Floors:', this.floors);
      },
      error: (error: any) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  filteredRooms(): any[] {
    if (!this.searchQuery?.trim()) {
      return this.rooms;
    }

    const search = this.searchQuery.toLowerCase();

    return this.rooms.filter(room =>
      room.roomNumber?.toLowerCase().includes(search) ||
      room.guest?.fullName?.toLowerCase().includes(search)
    );
  }

  getRoomsByFloor(floorNo: number): any[] {
    return this.filteredRooms().filter(room => room.floorNo === floorNo);
  }

  searchQuery = '';

  activities = [
    { id: 1, room: '101', action: 'Check-in', guest: 'A. Sharma', time: '10 mins ago' },
    { id: 2, room: '201', action: 'Service', guest: 'Breakfast Served', time: '45 mins ago' },
    { id: 3, room: '114', action: 'Checkout', guest: 'Complete', time: '2 hours ago' },
    { id: 4, room: '105', action: 'Payment', guest: 'Received', time: '3 hours ago' },
    { id: 5, room: '305', action: 'Check-in', guest: 'K. Verma', time: '5 hours ago' }
  ];

  // filteredRooms = computed(() => {
  //   const query = this.searchQuery().toLowerCase();
  //   const rooms = this.roomService.rooms();

  //   if (!query) return rooms;

  //   return rooms.filter(r =>
  //     r.roomNumber.includes(query) ||
  //     r.guest?.fullName.toLowerCase().includes(query) ||
  //     r.guest?.city.toLowerCase().includes(query)
  //   );
  // });

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

  openBookingDialog(room: any) {

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
        // this.roomService.updateRoomStatus(
        //   room.roomNumber,
        //   RoomStatus.OCCUPIED,
        //   result
        // );
      }
    });
  }
}