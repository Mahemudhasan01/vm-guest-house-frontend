export interface Guest {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  mobileNumber: string;
  idProofType: string;
}

export enum RoomStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied'
}

export interface Room {
  id: string;
  roomNumber: string;
  status: RoomStatus;
  guest?: Guest;
  floor: number;
}
