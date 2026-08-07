import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CheckOutService {
  
  constructor(private http: HttpClient) { }

  getAll(params: any) {
    const options = { params };
    return this.http.get<any>(`${environment.USER_ENDPOINT_URL}/`, options);
  }
}
