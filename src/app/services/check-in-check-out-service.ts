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
}
