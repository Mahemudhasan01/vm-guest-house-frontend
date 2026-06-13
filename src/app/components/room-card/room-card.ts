import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoomService } from '../../services/room-service';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './room-card.html',
  styleUrl: './room-card.css'
})
export class RoomCard implements OnInit {
  constructor(
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    // this.getAllRooms();
  }

  room = input.required<any>();
  roomDoubleClick = output<any>();

  onDblClick() {
    this.roomDoubleClick.emit(this.room());
  }

  getTooltipContent(): string {
    const r = this.room();
    if (r.status === 'OCCUPIED' && r.guest
    ) {
      return `Guest: ${r.guest.fullName} | City: ${r.guest.city}`;
    }
    return `Room ${r.roomNumber} - Vacant`;
  }

  // getAllRooms() {
  //   this.roomService.getAllRooms({}).subscribe({
  //     next: (response) => {
  //       console.log('All rooms:', response);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching all rooms:', error);
  //     }
  //   });
  // }
}