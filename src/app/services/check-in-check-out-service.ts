import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CheckInCheckOutService {
  
  constructor(private http: HttpClient) { }

  saveCheckingDetails(payload: any){
    return this.http.post<any>(`${environment.USER_ENDPOINT_URL}/checkin`, payload);
  }

  updateCheckingDetails(payload: any){
    return this.http.put<any>(`${environment.USER_ENDPOINT_URL}/checkin`, payload);
  }

  getAll(params: any) {
    const options = { params };
    return this.http.get<any>(`${environment.USER_ENDPOINT_URL}/checkin`, options);
  }

  getGuestDtlsByRoomId(roomId: any) {
    return this.http.get<any>(`${environment.USER_ENDPOINT_URL}/checkin/current-guest/${roomId}`);
  }


}
