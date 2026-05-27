import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room, RoomStatus } from '../../models/room.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
export class RoomCard {
  room = input.required<Room>();
  roomDoubleClick = output<Room>();
  onDblClick() {
    this.roomDoubleClick.emit(this.room());
  }
  getTooltipContent(): string {
    const r = this.room();
    if (r.status === RoomStatus.OCCUPIED && r.guest
    ) {
      return `Guest: ${r.guest.fullName} | City: ${r.guest.city}`;
    }
    return `Room ${r.roomNumber} - Vacant`;
  }
}