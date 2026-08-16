import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  
  convertDateToDataBaseFormat(date: any) {
    // YYYY-MM-DD
    if (date) {
      let day = date.getDate().toString();
      if (day.length != 2) {
        day = '0' + day;
      }
      let month = (date.getMonth() + 1).toString();
      if (month.length != 2) {
        month = '0' + month;
      }
      return `${date.getFullYear()}-${month}-${day}`;
    }
    return '';
  }
}
