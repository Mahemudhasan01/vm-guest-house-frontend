import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  
  constructor(private http: HttpClient) { }

  // getAllRooms(payload: any) {
  //   return this.http.get<any>(`${environment.USER_ENDPOINT_URL}/rooms`, payload);
  // }

  getAllRooms(payload: any): any {
    return this.http.get<any>(
      `${environment.USER_ENDPOINT_URL}/rooms`, { params: payload }
    );
  }
}