import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {



  controller: string = "Order";
  constructor(private _apiService: ApiService) { }

  get(code,isArchived:boolean=false) {
    return this._apiService.get(`/${this.controller}/GetOrderDetails?code=${code}&isArchived=${isArchived??false}`);
  }
  
}
