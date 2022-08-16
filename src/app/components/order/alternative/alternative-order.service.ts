import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class AlternativeOrderService {
  controller: string = "Order";
  constructor(private apiService: ApiService) { }

  get(id) {
    return this.apiService.get(`/${this.controller}/GetAlternativeOrders?tripID=${id}`);
  }}
