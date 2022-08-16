import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderTripService {

  controller: string = "branchmanager/Order";
  constructor(private _apiService: ApiService) { }

  RemoveOrder(id) {
    return this._apiService.get(`/${this.controller}/RemoveFromTrip?id=${id}`);
  }}
