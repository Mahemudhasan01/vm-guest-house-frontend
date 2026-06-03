import { Injectable, signal, computed } from '@angular/core';
import { Room, RoomStatus, Guest } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomsSignal = signal<Room[]>(this.generateInitialRooms());

  rooms = computed(() => this.roomsSignal());
  occupiedCount = computed(() => this.roomsSignal().filter(r => r.status === RoomStatus.OCCUPIED).length);
  vacantCount = computed(() => this.roomsSignal().filter(r => r.status === RoomStatus.VACANT).length);

  private generateInitialRooms(): Room[] {
    const rooms: Room[] = [];
    
    // 101 - 126
    for (let i = 1; i <= 26; i++) {
        const roomNumber = (100 + i).toString();
        rooms.push({
            id: `room-${roomNumber}`,
            roomNumber,
            status: Math.random() > 0.8 ? RoomStatus.OCCUPIED : RoomStatus.VACANT,
            floor: 1,
            guest: Math.random() > 0.8 ? this.getMockGuest() : undefined
        });
    }

    // 201 - 206
    for (let i = 1; i <= 6; i++) {
        const roomNumber = (200 + i).toString();
        rooms.push({
            id: `room-${roomNumber}`,
            roomNumber,
            status: Math.random() > 0.7 ? RoomStatus.OCCUPIED : RoomStatus.VACANT,
            floor: 2,
            guest: Math.random() > 0.7 ? this.getMockGuest() : undefined
        });
    }

    // 301 - 306
    for (let i = 1; i <= 6; i++) {
        const roomNumber = (300 + i).toString();
        rooms.push({
            id: `room-${roomNumber}`,
            roomNumber,
            status: Math.random() > 0.9 ? RoomStatus.OCCUPIED : RoomStatus.VACANT,
            floor: 3,
            guest: Math.random() > 0.9 ? this.getMockGuest() : undefined
        });
    }

    return rooms;
  }

  private getMockGuest(): Guest {
      return {
          fullName: 'John Doe',
          address: '123 Tech Lane',
          city: 'Innovation City',
          state: 'California',
          pinCode: '90001',
          mobileNumber: '9876543210',
          idProofType: 'Aadhaar'
      };
  }

  updateRoomStatus(roomNumber: string, status: RoomStatus, guest?: Guest) {
    this.roomsSignal.update(rooms => rooms.map(r => 
      r.roomNumber === roomNumber ? { ...r, status, guest } : r
    ));
  }
}
